<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');
require APPPATH . '/libraries/REST_Controller.php';
class MY_Controller extends REST_Controller {
	public function __construct() {
		parent::__construct();
	}
}
