<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class User_to_skill extends MY_Model {
	public function __construct() {
		parent::__construct();
		$this->_table = 'user_to_skill';
		$this->_id_attribute = 'user_to_skill_id';
	}

	/**
	 * @param $user_id
	 *
	 * @return array|bool
	 */
	public function get_user_skills($user_id){
		$this->db->select('color, name');
		$this->db->join('users_skills', 'skill_id');
		$this->db->where('user_id', $user_id);
		$query = $this->db->get('user_to_skill');
		return $query && $query->num_rows() ? $query->result() : false;
	}
}