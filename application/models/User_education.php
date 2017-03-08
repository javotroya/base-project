<?php if ( ! defined('BASEPATH')) {
	exit('No direct script allowed');
}

class User_education extends MY_Model {
	public function __construct() {
		parent::__construct();
		$this->_table = 'user_education';
		$this->_id_attribute = 'user_id';
	}
}