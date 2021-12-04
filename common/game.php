<?php declare(strict_types=1);
require __DIR__ . "/inc/include.php";

$girl;

function assertGirlSelected(): void
{
    global $girl;
    global $GAME;
    
    if(isset($girl))
        return;
    
    header("HTTP/1.1 302 Found");
    header("Location: ../common/char.php?return=$GAME");
}

if(isset($_COOKIE["girl"])) {
    $girls = getGirlsThatSupportGame($GAME);
    if(isset($girls[$_COOKIE["girl"]])) {
        $girl = (object) [];
        $g    = $girls[$_COOKIE["girl"]];
        
        $girl->id          = $g->id;
        $girl->name        = $g->name[__GetUserLanguage()] ?? $g->name["_"];
        $girl->description = $g->description[__GetUserLanguage()] ?? $g->description["_"];
        $girl->config      = (object) $g->games[$GAME];
    }
}

setTrDomain($GAME);
setTrLanguage(__GetUserLanguage());
