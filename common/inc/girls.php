<?php declare(strict_types=1);
use Nette\Neon\Neon;

function getGirls(): Traversable
{
    foreach(glob(__DIR__ . "/../girls/*", GLOB_ONLYDIR) as $girlPath) {
        if(!file_exists($girlPath . "/girl.neon"))
            continue; # not a girl dir
        
        $id   = array_reverse(explode("/", $girlPath))[0];
        $girl = (object) Neon::decodeFile($girlPath . "/girl.neon");
        
        $girl->id    = $id;
        $girl->ava   = "girls/$id/ava.png?ava=1";
        $girl->games = [];
        foreach(glob("$girlPath/*", GLOB_ONLYDIR) as $gamePath) {
            $gameId = array_reverse(explode("/", $gamePath))[0];
            if(!file_exists("$gamePath/$gameId.neon"))
                continue;
            
            $girl->games[$gameId] = Neon::decodeFile("$gamePath/$gameId.neon");
        }
        
        yield $id => $girl;
    }
}

function getGirlsThatSupportGame(string $game): array
{
    $girls = iterator_to_array(getGirls());
    $girls = array_filter($girls, function($girl) use ($game) {
        return isset($girl->games[$game]);
    });
    
    return $girls;
}
