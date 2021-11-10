<?php declare(strict_types=1);
require __DIR__ . "/common/inc/include.php";

$girl;
if(isset($_COOKIE["girl"])) {
    $girls = iterator_to_array(getGirls());
    if(isset($girls[$_COOKIE["girl"]]))
        $girl = $girls[$_COOKIE["girl"]];
}

$games;
foreach(glob(__DIR__ . "/*/game.gif") as $gamePoster) {
    $gameId = array_reverse(explode("/", $gamePoster))[1];
    
    $games[$gameId] = $gamePoster;
}

setTrDomain("::");
setTrLanguage(__GetUserLanguage());

?>

<html>
    <head>
        <title><?= tr("select_game") ?> | <?= tr("product_name") ?></title>
        <link rel="stylesheet" href="common/styles.css" />
        <link rel="stylesheet" href="index.css" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
    </head>
    <body>
        <div id="YourChar" class="border">
            <?php if(isset($girl)): ?>
                <img src="common/girls/<?= $girl->id ?>/ava.png?ava=1" />
                <div id="CharInfo">
                    <h2><?= $girl->name[__GetUserLanguage()] ?? $g->names["_"] ?></h2>
                    <span><?= tr("selected_char") ?> <a href="common/char.php?from=index"><?= tr("change_char") ?></a></span>
                </div>
            <?php else: ?>
                <img src="common/noGirl.png" />
                <div id="CharInfo">
                    <h2><?= tr("no_char_name") ?></h2>
                    <span><?= tr("no_char_selected") ?> <a href="common/char.php?from=index"><?= tr("pick_char") ?></a></span>
                </div>
            <?php endif; ?>
        </div>
        
        <center>
            <h1><?= tr("product_name")?>: <?= tr("select_game") ?></h1>
            <p><?= tr("product_description") ?></p>
        </center>
        
        <div class="games">
            <?php foreach($games as $id => $poster): ?>
                <div class="game border">
                    <a href="<?= $id ?>/index.php?from=index">
                        <img src="<?= $id ?>/game.gif" />
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </body>
</html>
