<?php defined( 'BASEPATH' ) OR exit( 'No direct script access allowed' );
$serverName = $_SERVER['SERVER_NAME'];
$cache_hash = "2017.02.26-21.57.88"; ?>


  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>AmigoEmpresa</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="shortcut icon" href="/img/favicon.png" type="image/png">
	  <?php if ( ENVIRONMENT == 'development' ): ?>
    <!-- JAVASCRIPT LIBRARIES -->
    <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="bower_components/underscore/underscore-min.js"></script>
    <script type="text/javascript" src="bower_components/underscore.string/dist/underscore.string.js"></script>
    <script type="text/javascript" src="bower_components/jquery-cookie/jquery.cookie.js"></script>
    <script type="text/javascript" src="bower_components/backbone/backbone.js"></script>
    <script type="text/javascript" src="source/helpers/typeahead.bundle.js"></script>
    <script type="text/javascript" src="bower_components/rivets/dist/rivets.bundled.min.js"></script>

    <script type="text/javascript" src="bower_components/jquery-validation/dist/jquery.validate.min.js"></script>
    <script type="text/javascript" src="bower_components/jquery-validation/dist/additional-methods.min.js"></script>
    <script type="text/javascript" src="bower_components/moment/min/moment.min.js"></script>
    <script type="text/javascript" src="bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="bower_components/bootstrap-timepicker/js/bootstrap-timepicker.js"></script>
    <script type="text/javascript" src="bower_components/jquery.maskedinput/dist/jquery.maskedinput.min.js"></script>
    <script type="text/javascript" src="bower_components/jquery-ui-1.11.4/jquery-ui.js"></script>
    <script type="text/javascript" src="bower_components/jquery-highlighttextarea/jquery.highlighttextarea.js"></script>

    <script type="text/javascript" src="bower_components/jquery-deparam/jquery-deparam.js"></script>
    <script type="text/javascript" src="bower_components/garand-sticky/jquery.sticky.js"></script>
    <script type="text/javascript" src="bower_components/jquery.nicescroll/jquery.nicescroll.min.js"></script>
    <script type="text/javascript" src="bower_components/clipboard/clipboard.js"></script>
    <script src="bower_components/select2/select2.min.js"></script>
    <script type="text/javascript" src="bower_components/google_libs/google_charts.js"></script>

    <script type="text/javascript" src="bower_components/uit.js/uit.js"></script>


    <!-- CSS STYLESHEETS-->
    <link rel="stylesheet" href="bower_components/jquery-file-upload/css/jquery.fileupload.css">
    <link rel="stylesheet" href="bower_components/jquery-file-upload/css/jquery.fileupload-ui.css">
    <link rel="stylesheet" href="bower_components/jquery-ui-1.11.4/jquery-ui.min.css">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="bower_components/bootstrap-datepicker/css/datepicker3.css">
    <link rel="stylesheet" href="bower_components/bootstrap-timepicker/css/bootstrap-timepicker.min.css">
    <link rel="stylesheet" href="bower_components/bootstrap-submenu/dist/css/bootstrap-submenu.min.css">
    <link rel="stylesheet" href="bower_components/jquery-highlighttextarea/jquery.highlighttextarea.min.css">
    <link href="bower_components/select2/select2.css" rel="stylesheet"/>
    <link href="bower_components/select2/select2-bootstrap.css" rel="stylesheet"/>
    <link href="source/theme/css/AdminLTE.min.css" rel="stylesheet">
    <link href="source/theme/css/_all-skins.min.css" rel="stylesheet">
    <link href="source/theme/plugins/iCheck/all.css" rel="stylesheet">
    <link href="styles/main.css" rel="stylesheet">
  </head>
  <body class="<?php echo ( $this->ion_auth->logged_in() ) ? 'hold-transition skin-blue sidebar-mini' : 'hold-transition login-page'; ?>">
  <div class="wrapper hidden">
    <header class="main-header"></header>
    <aside class="main-sidebar"></aside>
    <div class="content-wrapper"></div>
    <footer class="main-footer"></footer>
    <div class="control-sidebar-bg"></div>
  </div>
  <div class="login-box hidden"></div>
  </body>
  <script type="text/javascript" src="ajax_setup.js"></script>
  <script type="text/javascript" src="application.js"></script>
  <script type="text/javascript" src="source/helpers/util_rivets.js"></script>
  <script type="text/javascript" src="source/helpers/util.js"></script>

  <script type="text/javascript" src="source/templates.js"></script>
  <?php $path = FCPATH;
  ReadDirAndPrintJsFiles( "{$path}source/models" );
  ReadDirAndPrintJsFiles( "{$path}source/collections" );
  ReadDirAndPrintJsFiles( "{$path}source/views" );
  ReadDirAndPrintJsFiles( "{$path}source/routes" );
  ?>
  <script type="text/javascript" src="singletons.js"></script>
  <script type="text/javascript" src="source/theme/js/app.min.js"></script>
  <script type="text/javascript" src="source/theme/plugins/iCheck/icheck.min.js"></script>
  <?php else: //production files. ?>
    <script type="text/javascript" src="source/prod/libs.js?v=<?php echo $cache_hash; ?>"></script>
    <link href="source/prod/libs.css?v=<?php echo $cache_hash; ?>" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link href="source/prod/main.css?v=<?php echo $cache_hash; ?>" rel="stylesheet">
    </head>
    <body class="<?php echo ( $this->ion_auth->logged_in() ) ? 'hold-transition skin-blue sidebar-mini' : 'hold-transition login-page'; ?>">
    <div class="wrapper hidden">
      <header class="main-header"></header>
      <aside class="main-sidebar"></aside>
      <div class="content-wrapper"></div>
      <footer class="main-footer"></footer>
      <div class="control-sidebar-bg"></div>
    </div>
    <div class="login-box hidden"></div>
    </body>

    <!-- Base Definition -->
    <script type="text/javascript" src="source/prod/app.js?v=<?php echo $cache_hash; ?>"></script>';
  <?php endif; ?>
  <!-- Start Application -->
  <script type="text/javascript">
      Backbone.history.start({pushState: false});
      window.customRivets = true;
  </script>
  </html>

<?php function ReadDirAndPrintJsFiles( $folder, $showHeaderFolder = false ) {
	$path = FCPATH;
	if ( $showHeaderFolder ) {
		echo "\n\t<!-- " . $folder . " -->";
	}
	if ( $handle = opendir( $folder ) ) {
		while( false !== ( $entry = readdir( $handle ) ) ){
			if ( $entry != "." && $entry != ".." && $entry[0] != "." ) {
				$pwd      = $folder . '/' . $entry;
				$checkDir = is_dir( $pwd );
				if ( $checkDir == 1 ) {
					ReadDirAndPrintJsFiles( $pwd, false );
				} else {
					if ( ! ( strpos( $entry, '.jst.ejs' ) > 0 ) ) {
						echo "\n\t<script src='" . str_replace( $path, '', $pwd ) . "'></script>\n";
					}
				}
			}
		}
		closedir( $handle );
	}
}
