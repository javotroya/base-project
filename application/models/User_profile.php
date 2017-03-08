<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class User_profile extends MY_Model {
	public function __construct() {
		parent::__construct();
		$this->_table = 'user_profile';
		$this->_id_attribute = 'user_id';
	}
}