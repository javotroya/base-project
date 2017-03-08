<?php if(!defined('BASEPATH')){
	exit('No direct script access allowed');
}

class Migrate extends MY_Controller {
	protected $verbose;
	protected $migration_version;
	protected $classname;

	public function __construct() {
		parent::__construct();
		$this->load->library('migration');
		$this->verbose                    = $this->config->item('migrations_verbose');
		$this->classname                  = strtolower(get_class($this));
		$this->migration->classname       = strtolower(get_class($this));
		$this->migration->_migration_path = $this->config->item('migration_path');
	}

	public function index() {
		$this->help();
	}

	public function run() {
		if(!is_cli()){
			show_error("You don't have permission for this action");
			exit;
		}
		$last_migration  = $this->_get_last_migration();
		$current_version = $this->migration->get_database_current_version();
		if($this->verbose){
			$this->cli_colors->string("-> Latest migration in directory is {$last_migration['number']}", 'green');
		}
		if($last_migration['number'] === $current_version){
			$this->cli_colors->string('-> Congratulations: Your database is current with migrations', 'white', 'green');
			exit;
		}
		if($last_migration['number'] < $current_version){
			$this->cli_colors->string('-> Warning: You should run the down or the to command if you want to downgrade the database', 'white', 'yellow');
			$this->cli_colors->string('-> Aborting...', 'red');
			exit;
		}
		if($this->verbose){
			$this->cli_colors->string('-> Running new migrations', 'blue');
		}
		$this->to($last_migration['number']);

		if(strtolower($this->classname) === 'migrate_master'){
			if($this->verbose){
				$this->cli_colors->string('-> Checking migration gaps', 'blue');
			}
			if(!$this->migration->file_gaps()){
				$this->cli_colors->string('-> There are no file gaps in your migrations', 'green');
			}
			if(!$this->migration->db_gaps()){
				$this->cli_colors->string('-> There are no database gaps in your migrations', 'green');
			}
		}
	}

	public function up() {
		$this->_to();
	}

	public function down() {
		$this->_to('down');
	}


	public function gap() {
		if($this->verbose){
			$this->cli_colors->string('-> Running firm migrations on Master database.', 'blue');
		}
		if(!$this->migration->file_gaps()){
			$this->cli_colors->string('-> No file gaps in Master database', 'blue');
		}
		if(!$this->migration->db_gaps()){
			$this->cli_colors->string('-> No database gaps in Master database', 'blue');
		}
	}

	public function version() {
		if(!is_cli()){
			show_error("You don't have permission for this action");
			exit;
		}
		$migration_version = $this->migration->get_database_current_version();
		$this->cli_colors->string('Database version of Master: ' . $migration_version, 'blue');
	}

	public function v() {
		$this->version();
	}

	public function help() {
		if(!is_cli()){
			show_error("You don't have permission for this action");
			exit;
		}
		$this->cli_colors->string('How migrations work:', 'blue');
		$this->cli_colors->string("-> {$this->classname} run:", 'green');
		$this->cli_colors->string("\tSearch for ALL migration GREATER than the current migration value and executes them");
		$this->cli_colors->string("-> {$this->classname} up:", 'green');
		$this->cli_colors->string("\tSearch for ONE migration GREATER than the current migration value and executes it");
		$this->cli_colors->string("-> {$this->classname} down:", 'green');
		$this->cli_colors->string("\tSearch for ONE migration LOWER than the current migration value and executes it");
		$this->cli_colors->string("-> {$this->classname} to:", 'green');
		$this->cli_colors->string("\tUpdate the database to the migration you specify");
		$this->cli_colors->string("-> {$this->classname} version|v:", 'green');
		$this->cli_colors->string("\tGets the last version number stored in the database");
		$this->cli_colors->string("-> {$this->classname} max:", 'green');
		$this->cli_colors->string("\tGets the max version in files which database can be updated to");
		$this->cli_colors->string("-> {$this->classname} [help|h]:", 'green');
		$this->cli_colors->string("\tShows this help text.");
		if($this->classname == 'migrate'){
			$this->cli_colors->string("-> {$this->classname} gap:", 'green');
			$this->cli_colors->string("\tLooks for gaps in database or code and run new migrations or deletes them from database.");
		}
		$warning_title = "WARNING";
		$warning_block = "\tAll up and down scripts should be written for scripts to work correctly.";
		$warning_block .= "\n\tIf something cannot be downgraded, we could always use copyDB shells cript.";
		$this->cli_colors->box($warning_title, $warning_block, 'brown');
	}

	public function h() {
		$this->help();
	}

	public function max() {
		$last = $this->_get_last_migration();
		$this->cli_colors->string("Last migration file which database can be updated to is\nNumber: {$last['number']}\nName: {$last['name']}", 'blue');
	}

	/**
	 * Migrate to specific version.
	 *
	 * @param $version
	 */
	public function to($version) {
		if(!is_cli()){
			show_error("You don't have permission for this action");
			exit;
		}

		if(null === $version){
			$this->cli_colors->string('This is not the version you are looking for', 'white', 'red');
			exit;
		}

		if($this->verbose){
			$this->cli_colors->string('Running migrations on Master Database', 'blue');
		}
		if($this->migration->version($version) === false){
			if($this->verbose){
				$this->cli_colors->string(" -> Migrations fail on Master Database.", 'white', 'red');
				$this->cli_colors->string(" -> Exiting with the following error message: ", 'white', 'red');
			}
			show_error($this->migration->error_string());
		} else {
			$this->cli_colors->string('Migration(s) on master DB done', 'green');
		}
	}

	protected function _to($direction = 'up') {
		if(!is_cli()){
			show_error("You don't have permission for this action");
			exit;
		}
		if($this->verbose){
			$this->cli_colors->string('-> Getting last migration in files.', 'blue');
		}
		$latest_migration = $this->_get_last_migration();

		if($this->verbose){
			$this->cli_colors->string('-> Getting last migration in database.', 'blue');
		}
		$current_version = $this->migration->get_database_current_version();

		if($latest_migration['number'] == $current_version && $direction == 'up'){
			$this->cli_colors->string('-> You are already in the last database migration available', 'red');
			$this->cli_colors->string("-> Migration version: {$current_version}", 'red');
			exit;
		}

		if($this->verbose){
			$this->cli_colors->string("-> Going one migration {$direction}.", 'blue');
		}
		if($direction == 'up'){
			++$current_version;
		} elseif($direction == 'down') {
			--$current_version;
		}
		if(!$this->_migration_exists($current_version)){
			$this->cli_colors->string("-> Migration {$current_version} is not available for update.", 'red');
			exit;
		}
		$this->to($current_version);
	}

	protected function _get_last_migration() {
		$migrations = $this->_get_migration_files();

		return end($migrations);
	}

	protected function _migration_exists($migration) {
		$migrations = $this->_get_migration_files();

		return array_key_exists($migration, $migrations);
	}

	protected function _get_migration_files() {
		return $this->migration->filter_migrations('m');
	}
}