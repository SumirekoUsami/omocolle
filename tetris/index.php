<?php
    $GAME = "tetris";
    
    require "../common/game.php";
    assertGirlSelected();
?>

<html>
    <head>
        <title>Omo!Tetris</title>
        <link rel="stylesheet" href="../common/styles.css" />
        <link rel="stylesheet" href="assets/styles.css" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
    </head>
    <body>
        <div id="loading"><?= tr("loading_libs") ?></div>
        <div id="game_ui" class="border" style="display: none;">
            <div id="board_wrap">
                <div id="board_container">
                    <div id="bladder_mask"></div>
                    <div id="board">
                        <table id="board__table">
                            <?php for($i = 0; $i < 12; $i++): ?>
                                <tr>
                                    <?php for($j = 0; $j < 8; $j++): ?>
                                        <td><div class="block"></div></td>
                                    <?php endfor; ?>
                                </tr>
                            <?php endfor; ?>
                        </table>
                    </div>
                    <div id="urinometer"></div>
                </div>
                
                <div id="instructions">
                    <div class="key">A</div>, <div class="key">D</div> &mdash; <?= tr("move") ?><br/>
                    <div class="key">W</div> &mdash; <?= tr("rotate") ?><br/>
                    <div class="key">S</div> &mdash; <?= tr("drop") ?>
                </div>
            </div>
            
            <div id="status_wrap">
                <div id="next_tetramino">
                    <h1><?= tr("next") ?></h1>
                    <div id="droplet">
                        <table id="droplet__table">
                            <?php for($i = 0; $i < 3; $i++): ?>
                                <tr>
                                    <?php for($j = 0; $j < 4; $j++): ?>
                                        <td><div class="block"></div></td>
                                    <?php endfor; ?>
                                </tr>
                            <?php endfor; ?>
                        </table>
                    </div>
                </div>
                
                <div id="girl"></div>
            </div>
        </div>
        
        <script>
            const girlName     = "<?= $girl->id ?>";
            const spriteFormat = "<?= $girl->config->spriteFormat ?>";
            const thresholds   = <?= json_encode($girl->config->thresholds) ?>;
        </script>
        
        <script src="node_modules/soundjs/lib/soundjs.min.js"></script>
        <script src="node_modules/preloadjs/lib/preloadjs.min.js"></script>
        
        <script src="assets/js/verge.js"></script>
        <script src="assets/js/arrays.js"></script>
        <script src="assets/js/tetraminoe.js"></script>
        <script src="assets/js/audio.js"></script>
        <script src="assets/js/Tetris.js"></script>
        <script src="assets/js/omo.js"></script>
    </body>
</html>
