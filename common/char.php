<?php declare(strict_types=1);
require __DIR__ . "/inc/include.php";

$game;
$girls = isset($game) ? getGirlsThatSupportGame($game) : iterator_to_array(getGirls());

if(isset($_GET["return"])) {
    $game = $_GET["return"];
    if(!file_exists(__DIR__ . "/../$game/game.gif")) {
        header("HTTP/1.1 404 Not Found");
        exit("There's no $game game here :<");
    }
}

if(isset($_GET["char"])) {
    if(!isset($girls[$_GET["char"]])) {
        header("HTTP/1.1 404 Not Found");
        exit("There's no $_GET[char] girl here :<");
    }
    
    $game ??= "";
    $loc    = empty($game) ? "../index.php" : "../$game/index.php";
    
    header("HTTP/1.1 302 Found");
    header("Location: $loc");
    setcookie("girl", $_GET["char"], strtotime("+1 week"), "/", "", false, true);
    
    exit;
}

setTrDomain("::");
setTrLanguage(__GetUserLanguage());

?>

<html>
    <head>
        <title><?= tr("select_char") ?> | <?= tr("product_name") ?></title>
        <link rel="stylesheet" href="styles.css" />
        <link rel="stylesheet" href="charsel.css" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
    </head>
    <body>
        <center>
            <h1><?= tr("select_char") ?></h1>
            
            <?php if(isset($game)): ?>
                <img id="poster" src="../<?= $game ?>/game.gif" alt="<?= $game ?>" />
            <?php endif; ?>
        </center>
        
        <div id="picker">
            <div class="girls">
                <?php foreach($girls as $id => $girl): ?>
                    <?php
                        $name = $girl->name[__GetUserLanguage()] ?? $girl->name["_"];
                        $description = $girl->description[__GetUserLanguage()] ?? $girl->description["_"]; ?>
                    
                    <div class="girl border" data-id="<?= $girl->id ?>" data-name="<?= $name ?>" data-description="<?= $description ?>" data-author="<?= $girl->authors[0]["name"] ?>;<?= $girl->authors[0]["url"] ?>">
                        <img src="<?= $girl->ava ?>" alt="<?= $name ?>" />
                    </div>
                <?php endforeach; ?>
            </div>
            
            <div class="description border">
                <h2 id="CharName"><?= tr("select_char") ?></h2>
                <p id="CharDesc"><?= tr("select_char_hint") ?></p>
                <p id="CharAuthor" style="display: none;"><strong><?= tr("char_author") ?>:</strong> <a id="CharAuthorLink" href=""></a></p>
            </div>
        </div>
        
        <script>const urlPrefix = "<?= isset($game) ? "?return=$game&" : "?" ?>";</script>
        <script src="charsel.js"></script>
    </body>
</html>
