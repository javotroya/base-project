<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class MY_Migration
 */
class MY_Migration extends CI_Migration {
	protected $ci;
	public $classname;

	/**
	 * Initialize Migration Class
	 *
	 * @param	array	$config
	 * @return	void
	 */
	public function __construct($config = []) {
		parent::__construct($config);
		$this->ci =& get_instance();
		$this->ci->load->model('migration_model');
	}

	/**
	 * @return int
	 */
	public function get_database_current_version() {
		return $this->_get_version();
	}

	/**
	 * @return bool
	 */
	public function is_migration_complete() {
		$is_complete = true;
		$files = $this->find_migrations();
		$migrations = $this->migration_model->get_all();
		if (count($files)) {
			foreach ($files as $number => $file) {
				if (strpos($file, 'placeholder')) { continue; }
				$number = intval($number);
				$migration = $this->migration_model->get_specific_version($number);
				if ($migration) { continue; }
				$is_complete = false;
				break;
			}
		}

		if ($is_complete && $migrations) {
			foreach ($migrations as $row) {
				if ( $row->version == 0 ) {
					continue;
				}
				$number = str_pad($row->version, 3, '0', STR_PAD_LEFT);
				if (strpos($files[$number], 'placeholder')) {
					$is_complete = false;
					break;
				}
			}
		}

		return $is_complete;
	}

	/**
	 * @return bool
	 */
	public function file_gaps() {
		if ($this->is_migration_complete()) {
			return false;
		}

		$files = $this->find_migrations();
		if (count($files)) {
			foreach ($files as $number => $file) {
				if (strpos($file, 'placeholder')) { continue; }
				$number = intval($number);
				$class = 'Migration_'.ucfirst(strtolower($this->_get_migration_name(basename($file, '.php'))));
				$migration = $this->migration_model->get_specific_version($number);
				if ($migration) { continue; }
				include_once $file;
				// Validate the migration file structure
				if( ! class_exists($class, false)){
					$this->_error_string = sprintf($this->lang->line('migration_class_doesnt_exist'), $class);
					show_error($this->_error_string);

					return false;
				}
				$instance = new $class();
				$method   = 'up';
				if( ! is_callable($class, $method)){
					$this->_error_string = sprintf($this->lang->line('migration_missing_' . $method . '_method'), $class);
					show_error($this->_error_string);

					return false;
				}
				$this->ci->cli_colors->string("\t-> Running migration $number: $class", 'blue');
				call_user_func(array( $instance, $method ));
				$this->_update_version($number, 'gap');

			}
		}
		return true;
	}

	/**
	 * @return bool
	 */
	public function db_gaps() {
		if ($this->is_migration_complete()) {
			return false;
		}

		$files = $this->find_migrations();
		$migrations = $this->migration_model->get_all();
		foreach ($migrations as $row) {
			$number = str_pad($row->version, 3, '0', STR_PAD_LEFT);
			$file = $files[$number];
			if (strpos($file, 'placeholder')) {
				$this->cli_colors->string("-> Deleting migration {$number} not found in code", 'red');
				$this->migration_model->delete($row->version);
			}
		}
		return true;
	}

	/**
	 * @param string $return_type
	 *
	 * @return array
	 */
	function filter_migrations($return_type = 's') {
		$files = $this->find_migrations();
		$migrations = [];
		foreach($files as $number => $file) {
			if (strpos($file, 'placeholder')){ continue; }
			if ($return_type == 's')
				$migrations[$number] = $file;
			elseif ($return_type == 'm') {
				$migrations[intval($number)] = [
					'number' => $number,
					'name' => $file,
				];
			}
		}
		for ($i = 0; $i < count($migrations); $i++) {
			if ( $i > 0 && array_key_exists( $i, $migrations ) ) {
				continue;
			}
			$number = str_pad($i, 3, '0', STR_PAD_LEFT);
			$file = "{$this->_migration_path}/{$number}_placeholder_{$number}.php";
			if ($return_type == 's')
				$migrations[$number] = $file;
			elseif ($return_type == 'm') {
				$migrations[intval($number)] = [
					'number' => $i,
					'name' => $file,
				];
			}
		}
		asort($migrations);
		return $migrations;
	}

	// --------------------------------------------------------------------

	/**
	 * Migrate to a schema version
	 *
	 * Calls each migration step required to get to the schema version of
	 * choice
	 *
	 * @param	string	$target_version	Target schema version
	 * @return	mixed	TRUE if already latest, FALSE if failed, string if upgraded
	 */
	public function version($target_version)
	{
		// Note: We use strings, so that timestamp versions work on 32-bit systems
		$current_version = $this->_get_version();

		if ($this->_migration_type === 'sequential')
		{
			$target_version = sprintf('%03d', $target_version);
		}
		else
		{
			$target_version = (string) $target_version;
		}

		$migrations = $this->find_migrations();

		if ($target_version > 0 && ! isset($migrations[$target_version]))
		{
			$this->_error_string = sprintf($this->lang->line('migration_not_found'), $target_version);
			return FALSE;
		}

		if ($target_version > $current_version)
		{
			// Moving Up
			$method = 'up';
		}
		else
		{
			// Moving Down, apply in reverse order
			$method = 'down';
			krsort($migrations);
		}

		if (empty($migrations))
		{
			return TRUE;
		}

		$previous = FALSE;

		// Validate all available migrations, and run the ones within our target range
		foreach ($migrations as $number => $file)
		{
			// Check for sequence gaps
			if ($this->_migration_type === 'sequential' && $previous !== FALSE && abs($number - $previous) > 1)
			{
				$this->_error_string = sprintf($this->lang->line('migration_sequence_gap'), $number);
				return FALSE;
			}

			include_once($file);
			$class = 'Migration_'.ucfirst(strtolower($this->_get_migration_name(basename($file, '.php'))));

			// Validate the migration file structure
			if ( ! class_exists($class, FALSE))
			{
				$this->_error_string = sprintf($this->lang->line('migration_class_doesnt_exist'), $class);
				return FALSE;
			}

			$previous = $number;

			// Run migrations that are inside the target range
			if (
				($method === 'up'   && $number > $current_version && $number <= $target_version) OR
				($method === 'down' && $number <= $current_version && $number > $target_version)
			)
			{
				$instance = new $class();
				if ( ! is_callable(array($instance, $method)))
				{
					$this->_error_string = sprintf($this->lang->line('migration_missing_'.$method.'_method'), $class);
					return FALSE;
				}

				log_message('debug', 'Migrating '.$method.' from version '.$current_version.' to version '.$number);
				call_user_func(array($instance, $method));
				$current_version = $number;
				$this->_update_version($current_version, $method);
			}
		}

		// This is kept for old migration script
		if ( ( $this->classname == 'migrate' && $current_version <= 40 ) ||
		     ( $this->classname == 'migrate_master' && $current_version <= 2 )
		) {
			// This is necessary when moving down, since the the last migration applied
			// will be the down() method for the next migration up from the target
			if ($current_version <> $target_version)
			{
				$current_version = $target_version;
				$this->_update_version($current_version);
			}
		}

		log_message('debug', 'Finished migrating to ' . $target_version);

		return $target_version;
	}

	// --------------------------------------------------------------------

	/**
	 * Retrieves current schema version
	 *
	 * @return	string	Current migration version
	 */
	protected function _get_version()
	{
		$version = $this->migration_model->get_version();
		return $version;
	}

	// --------------------------------------------------------------------

	/**
	 * Stores the current schema version
	 *
	 * @param	string	$migration	Migration reached
	 * @return	void
	 */
	protected function _update_version($migration, $method = 'up')
	{
		$migration = intval($migration);
		$change    = $this->classname == 'migration' ? 40 : 2;
		if ( $migration <= $change && $method != 'gap' ) {
			$this->db->update( $this->_migration_table, array(
				'version' => $migration
			) );
		} else {
			if ( $method === 'up' || $method === 'gap' ) {
				$this->migration_model->insert( $migration );
			} elseif ( $method === 'down' ) {
				$this->migration_model->delete( $migration );
			}
		}
	}
}
