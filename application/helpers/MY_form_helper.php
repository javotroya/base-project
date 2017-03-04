<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

if(!function_exists('prepare_data')){
	/**
	 * @param object $object
	 * @param array $skip
	 *
	 * @return array
	 */
	function prepare_data($object, $skip = []){
		$data = [];
		if(!is_object($object)){
			return [];
		}
		if(!is_array($skip)){
			return [];
		}
		foreach($object as $key => $val){
			if(!in_array($key, $skip)){
				$data[$key] = $val;
			}
		}
		unset($data['message']);
		return $data;
	}
}