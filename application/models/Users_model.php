<?php if ( ! defined('BASEPATH')) {
	exit('No direct script allowed');
}

class Users_model extends MY_Model {
	public function __construct() {
		parent::__construct();
		$this->_table = 'users';
		$this->_id_attribute = 'id';
	}
}