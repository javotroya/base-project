this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};

this["App"]["Templates"]["baseFooter"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div class="pull-right hidden-xs">\n    Anything you want\n</div>\n<!-- Default to the left -->\n<strong>Copyright &copy; 2016 <a href="#">Company</a>.</strong> All rights reserved.';
return __p
};

this["App"]["Templates"]["baseHeader"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<a href="#" class="logo">\n    <span class="logo-mini"><b>A</b>E</span>\n    <span class="logo-lg"><b>Amigo</b>Empresa</span>\n</a>\n<nav class="navbar navbar-static-top" role="navigation">\n    <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">\n        <span class="sr-only">Toggle navigation</span>\n    </a>\n    <div class="navbar-custom-menu">\n        <ul class="nav navbar-nav">\n            <li class="dropdown user user-menu">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n                    <!-- The user image in the navbar-->\n                    <img src="img/users/1.png" class="user-image" alt="User Image">\n                    <!-- hidden-xs hides the username on small devices so only the image appears. -->\n                    <span class="hidden-xs">{model.getFullName}</span>\n                </a>\n                <ul class="dropdown-menu">\n                    <!-- The user image in the menu -->\n                    <li class="user-header">\n                        <img src="img/users/1.png" class="img-circle" alt="User Image">\n\n                        <p>\n                            {model.getFullName}\n                            <small>{model:role}</small>\n                        </p>\n                    </li>\n                    <!-- Menu Footer-->\n                    <li class="user-footer">\n                        <div class="pull-left">\n                            <a href="#profile" class="btn btn-default btn-flat">Mi Perfil</a>\n                        </div>\n                        <div class="pull-right">\n                            <a href="#session/logout" class="btn btn-default btn-flat">Cerrar Sesión</a>\n                        </div>\n                    </li>\n                </ul>\n            </li>\n            <!-- Control Sidebar Toggle Button -->\n            <li>\n                <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>\n            </li>\n        </ul>\n    </div>\n</nav>\n';
return __p
};

this["App"]["Templates"]["baseMainSidebar"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div class="user-panel">\n    <div class="pull-left image">\n        <img src="img/users/1.png" class="img-circle" alt="User Image">\n    </div>\n    <div class="pull-left info">\n        <p>{model.getFullName}</p>\n        <a href="#"><i class="fa fa-circle text-success"></i> En línea</a>\n    </div>\n</div>\n<ul class="sidebar-menu">\n    <li class="header">Aplicación</li>\n    <li><a href="#recruitment"><i class="fa fa-file-text-o"></i> <span>Reclutamiento</span></a></li>\n    <li class="header">Administración</li>\n    <li><a href="#users"><i class="fa fa-users"></i> <span>Usuarios</span></a></li>\n</ul>';
return __p
};

this["App"]["Templates"]["baseSidebarControl"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<ul class="nav nav-tabs nav-justified control-sidebar-tabs">\n    <li class="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>\n    <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>\n</ul>\n<!-- Tab panes -->\n<div class="tab-content">\n    <!-- Home tab content -->\n    <div class="tab-pane active" id="control-sidebar-home-tab">\n        <h3 class="control-sidebar-heading">Recent Activity</h3>\n        <ul class="control-sidebar-menu">\n            <li>\n                <a href="javascript:;">\n                    <i class="menu-icon fa fa-birthday-cake bg-red"></i>\n\n                    <div class="menu-info">\n                        <h4 class="control-sidebar-subheading">Langdon\'s Birthday</h4>\n\n                        <p>Will be 23 on April 24th</p>\n                    </div>\n                </a>\n            </li>\n        </ul>\n        <!-- /.control-sidebar-menu -->\n\n        <h3 class="control-sidebar-heading">Tasks Progress</h3>\n        <ul class="control-sidebar-menu">\n            <li>\n                <a href="javascript:;">\n                    <h4 class="control-sidebar-subheading">\n                        Custom Template Design\n                        <span class="pull-right-container">\n                  <span class="label label-danger pull-right">70%</span>\n                </span>\n                    </h4>\n\n                    <div class="progress progress-xxs">\n                        <div class="progress-bar progress-bar-danger" style="width: 70%"></div>\n                    </div>\n                </a>\n            </li>\n        </ul>\n        <!-- /.control-sidebar-menu -->\n\n    </div>\n    <!-- /.tab-pane -->\n    <!-- Stats tab content -->\n    <div class="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>\n    <!-- /.tab-pane -->\n    <!-- Settings tab content -->\n    <div class="tab-pane" id="control-sidebar-settings-tab">\n        <form method="post">\n            <h3 class="control-sidebar-heading">General Settings</h3>\n\n            <div class="form-group">\n                <label class="control-sidebar-subheading">\n                    Report panel usage\n                    <input type="checkbox" class="pull-right" checked>\n                </label>\n\n                <p>\n                    Some information about this general settings option\n                </p>\n            </div>\n            <!-- /.form-group -->\n        </form>\n    </div>\n    <!-- /.tab-pane -->\n</div>\n';
return __p
};

this["App"]["Templates"]["sessionLogin"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div class="login-logo">\n    <a href="#"><b>Amigo</b>Empresa</a>\n</div>\n<div class="login-box-body">\n    <p class="login-box-msg">Identifícate para iniciar tu sesión</p>\n\n    <form action="javascript:;" method="post" autocomplete="off" novalidate>\n        <input type="hidden" name="msg">\n        <div class="form-group has-feedback">\n            <input type="email" class="form-control" placeholder="Email" name="identity" required>\n            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>\n        </div>\n        <div class="form-group has-feedback">\n            <input type="password" class="form-control" placeholder="Contraseña" name="password" required>\n            <span class="glyphicon glyphicon-lock form-control-feedback"></span>\n        </div>\n        <div class="row">\n            <div class="col-xs-8">\n                <div class="checkbox icheck">\n                    <label>\n                        <input type="checkbox" name="remember"> Recordar mis datos\n                    </label>\n                </div>\n            </div>\n            <div class="col-xs-4">\n                <button type="submit" class="btn btn-primary btn-block btn-flat">Entrar</button>\n            </div>\n        </div>\n    </form>\n    <a href="#">Olvide mi clave</a><br>\n</div>';
return __p
};

this["App"]["Templates"]["sharedContentHeader"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<section class="content-header">\n    <h1>\n        {header}\n        <small rv-if="description">{description}</small>\n    </h1>\n</section>';
return __p
};

this["App"]["Templates"]["testHelp"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div>View for help</div>';
return __p
};

this["App"]["Templates"]["testIndex"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<section class="content-header">\n    <h1>\n        Page Header\n        <small>Optional description</small>\n    </h1>\n    <ol class="breadcrumb">\n        <li><a href="#"><i class="fa fa-dashboard"></i> Level</a></li>\n        <li class="active">Here</li>\n    </ol>\n</section>\n\n<!-- Main content -->\n<section class="content">\n\n    <!-- Your Page Content Here -->\n\n</section>\n';
return __p
};

this["App"]["Templates"]["usersList"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div>View for list</div>';
return __p
};