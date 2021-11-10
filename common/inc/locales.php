<?php declare(strict_types=1);
use Nette\Neon\Neon;

$lang;
$domain;
$defaultLang = "en";

function setTrDomain(string $_Domain): void {
    global $domain;
    $domain = $_Domain;
}

function setTrLanguage(string $_Lang): void {
    global $lang;
    $lang = $_Lang;
}

function __GetUserLanguage(): string
{
    return $_GET["_Lang"] ?? explode("_", locale_accept_from_http($_SERVER["HTTP_ACCEPT_LANGUAGE"]))[0];
}

function __FetchLanguage(string $domain, string $id): array
{
    global $defaultLang;
    
    $dir  = __DIR__ . ($domain == "::" ? "/../"  : "/../../$domain") . "/locales/";
    $file = "$dir$id.locale";
    if(!file_exists($file)) {
        if($id === $defaultLang)
            return [];
        
        return __FetchLanguage($domain, $defaultLang);
    }
    
    $res = Neon::decodeFile($file);
    return !$res ? [] : $res;
}

function tr(string $id): string
{
    global $lang;
    global $domain;
    static $lgCache = [];
    if(!isset($lgCache[$domain]))
        $lgCache[$domain] = [];
    
    if(!isset($lgCache[$domain][$lang]))
        $lgCache[$domain][$lang] = __FetchLanguage($domain, $lang);
    
    return $lgCache[$domain][$lang][$id] ?? "[no resource for $id]";
}
