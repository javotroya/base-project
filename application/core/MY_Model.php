<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class MY_Model extends CI_Model{
	protected $_table, $_id_attribute;
	/**
	 * MY_Model constructor.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * @param $data
	 *
	 * @return bool|string
	 */
	public function save($data){
		return $this->db->insert($this->_table, $data) ? $this->db->insert_id() : false;
	}

	/**
	 * @param null $email_local_id
	 *
	 * @return mixed object|array|bool
	 */
	public function get($id = null){
		if($id){
			$this->db->where($this->_id_attribute, $id);
		}

		$query = $this->db->get($this->_table);
		if($id){
			return $query && $query->num_rows() ? $query->row() : false;
		}
		return $query && $query->num_rows() ? $query->result() : false;
	}

	/**
	 * @param array|string $field_name
	 * @param $value
	 *
	 * @return mixed object|bool
	 */
	public function get_one_by($field_name, $value = null){
		if(is_array($field_name)){
			$this->db->where($field_name);
		} else {
			$this->db->where($field_name, $value);
		}
		$query = $this->db->get($this->_table);
		return $query && $query->num_rows() ? $query->row() : false;
	}

	/**
	 * @param $field_name
	 * @param null $value
	 *
	 * @return mixed array|bool
	 */
	public function get_results_by($field_name, $value = null, $limit = null, $offset = 0){
		if(is_array($field_name)){
			$this->db->where($field_name);
		} else {
			$this->db->where($field_name, $value);
		}
		if($limit && is_numeric($limit)){
			$this->db->limit($limit, $offset);
		}
		$query = $this->db->get($this->_table);
		return $query && $query->num_rows() ? $query->result() : false;
	}

	/**
	 * @return int
	 */
	public function count_total(){
		return $this->db->count_all_results($this->_table);
	}

	/**
	 * @param $id
	 * @param $data
	 *
	 * @return bool|int
	 */
	public function update($id, $data){
		$this->db->where($this->_id_attribute, $id);
		return $this->db->update($this->_table, $data) ? $this->db->affected_rows() : false;
	}

	/**
	 * @param $id
	 *
	 * @return bool|int
	 */
	public function delete($id){
		$this->db->where($this->_id_attribute, $id);
		return $this->db->delete($this->_table) ? $this->db->affected_rows() : false;
	}
}