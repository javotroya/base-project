#!/usr/bin/php
<?php
function createView(){
global $argv, $argc;

function invalidSyntax () {
    echo "Error:\nInvalid Syntax, example usage: php createView app_folder/views/path_new_view\n";
    exit;
}

if (count($argv) == 1) {
    invalidSyntax();
}

$argv1 = explode(".",$argv[1]);
$argv1 = $argv1[0];
$fileName = "$argv1".".js";
$templateName = "$argv1".".jst.ejs";

$filesExp = explode("/", $argv1);

//// Verify if the path start with: source/views/ AND end with the rest of piece of path relative for the template.
//if (substr(join('/', $filesExp), 0, 13) != 'source/views/' || strlen(substr(join('/', $filesExp), 13, strlen(join('/', $filesExp)))) == 0) {
//    invalidSyntax();
//}

$listNameSpaceFile = explode("/", $argv1);

// Remove the file name from the array
array_pop($filesExp);

// Create Path if not exists
$folderCreated = array();
if (!is_dir(join("/", $filesExp))) {
    $pathTemp = "";
    foreach ($filesExp as $folder) {
        $pathTemp .= "$folder/";
        if (!file_exists($pathTemp)) {
            array_push($folderCreated, $pathTemp);
            mkdir($pathTemp, 0777);
        }
    }
}

// Removing source
array_shift($filesExp);

// Removing views
array_shift($filesExp);

// Upper each name of folder
foreach ($filesExp as &$namePath) {
    $underscore = explode('_', $namePath);
    if (sizeof($underscore) > 1) {
        $namePathTemp = lcfirst($underscore[0]);
        for($i = 1; $i < sizeof($underscore); $i++) {
            $namePathTemp = $namePathTemp . ucfirst($underscore[$i]);
        }
        $namePath = $namePathTemp;
    }
    $namePath = ucfirst($namePath);
}

// Conditions name space for header
$headerNameSpace = "";
$pathNameSpace = "";
foreach ($filesExp as $pathFolder) {
$pathNameSpace .= '.' . $pathFolder;
$headerNameSpace .=
<<< EOF

if (_.isUndefined(App.Views{$pathNameSpace})) {
    App.Views{$pathNameSpace} = {};
}

EOF;
}

// Removing source
array_shift($listNameSpaceFile);

// Removing views
array_shift($listNameSpaceFile);

// Upper each name of folder
foreach ($listNameSpaceFile as &$namePath) {
    $underscore = explode('_', $namePath);
    if (sizeof($underscore) > 1) {
        $namePathTemp = lcfirst($underscore[0]);
        for($i = 1; $i < sizeof($underscore); $i++) {
            $namePathTemp = $namePathTemp . ucfirst($underscore[$i]);
        }
        $namePath = $namePathTemp;
    }
    $namePath = ucfirst($namePath);
}

// Name Space of view
$nameSpaceFile = join('.', $listNameSpaceFile);
$nameSpaceFileClassName = join('', $listNameSpaceFile);
// ClassName of view
$view = lcfirst($listNameSpaceFile[count($listNameSpaceFile) - 1]);

$file=fopen($fileName,"w") or exit("Unable to create view file!");

// Name Space of template
$templatePathRelative = lcfirst(join('', $listNameSpaceFile));

$fileText = <<<EOF
'use strict';
{$headerNameSpace}
App.Views.{$nameSpaceFile} = App.Helpers.View.extend({
    template: App.Templates.{$templatePathRelative},
    className: '{$nameSpaceFileClassName}',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});
EOF;

fwrite($file, $fileText);
fclose($file);


$fileTemplate=fopen("$templateName","w") or exit("Unable to create template file!");

fwrite($fileTemplate, "<div>View for $view</div>");
fclose($fileTemplate);

if (count($folderCreated) > 0) {
    echo "The following have been created:\n";
    foreach ($folderCreated as $path) {
        echo "- $path\n";
    }
}
echo "The View $view has been created successfully!.\n";
}

createView();
