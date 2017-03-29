<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class User extends MY_Controller{
	const USER_SAVED_SUCCESS = 'Se ha guardado el usuario correctamente';
	const USER_NOT_FOUND = 'No se encontró el usuario';
	public function __construct() {
		parent::__construct();
		$models = [
			'users_model',
			'user_profile',
			'user_skills',
			'user_to_skill',
			'user_education'
		];
		$this->load->model($models);
		$this->load->helper('form');
	}

	public function index_get($user_id){
		$user = $this->users_model->get($user_id, 'email, first_name, last_name, phone, id');
		if($user){
			$user = prepare_data($user);
			$user_profile = $this->user_profile->get($user_id);
			if($user_profile){
				$user_profile = prepare_data($user_profile, ['password']);
				$user = array_merge($user, $user_profile);
			}
			$user_skills = $this->user_to_skill->get_user_skills($user_id);
			if($user_skills){
				$user['skills'] = $user_skills;
			}
			$user_education = $this->user_education->get_results_by('user_id', $user_id, 0, 0, ['date', 'desc']);
			if($user_education){
				$user['education'] = $user_education;
			}
			$this->response($user, REST_Controller::HTTP_OK);
		}
		$this->response(['status' => false, 'message' => self::USER_NOT_FOUND], REST_Controller::HTTP_BAD_REQUEST);
	}

	public function index_put($user_id){
		$post_vars = json_decode($this->input->raw_input_stream);
		$this->load->library('form_validation');
		$validation = $this->form_validation;
		$data = prepare_data($post_vars);
		$validation->set_data($data);
		if(!$validation->run('user')){
			$this->response(['message' => $validation->error_string()], REST_Controller::HTTP_BAD_REQUEST);
		} else {
			$this->users_model->update($user_id, $data);
			$this->response(['message' => self::USER_SAVED_SUCCESS], REST_Controller::HTTP_CREATED);
		}
		$this->response(['message' => MY_Controller::GENERIC_ERROR_MESSAGE], REST_Controller::HTTP_BAD_REQUEST);
	}
}