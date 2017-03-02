<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class MY_Model extends CI_Model{
	protected $_table, $_id_attribute;
	public function __construct() {
		parent::__construct();
	}

	public function get($id = null) {
		if ( $id ) {
			$this->db->where($this->_id_attribute, $id );
		}
		$query = $this->db->get($this->_table);
		if($id) {
			return $query && $query->num_rows() > 0 ? $query->row() : false;
		}
		return $query && $query->num_rows() > 0 ? $query->result() : false;
	}

	public function get_by($field, $equals_to = ''){
		$this->db->where($field, $equals_to);
		$query = $this->db->get($this->_table);
		return $query && $query->num_rows() > 0 ? $query->result() : false;
	}
}