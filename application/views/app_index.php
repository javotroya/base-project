<?php defined('BASEPATH') OR exit('No direct script access allowed');
$cache_hash = "2017.02.26-21.57.88"; ?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AmigoEmpresa</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link rel="shortcut icon" href="/img/favicon.png" type="image/png">
  <script type="text/javascript" src="source/prod/libs.js?v=<?php echo $cache_hash; ?>"></script>
  <link href="source/prod/libs.css?v=<?php echo $cache_hash; ?>" rel="stylesheet">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
  <link href="source/prod/main.css?v=<?php echo $cache_hash; ?>" rel="stylesheet">
</head>
<body class="<?php echo ($this->ion_auth->logged_in()) ? 'hold-transition skin-blue sidebar-mini' : 'hold-transition login-page'; ?>">
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
<script type="text/javascript" src="source/prod/app.js?v=<?php echo $cache_hash; ?>"></script>
';
<!-- Start Application -->
<script type="text/javascript">
    Backbone.history.start({pushState: false});
    window.customRivets = true;
</script>
</html>
