<?php
include "server.php";
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Scheduler Login page</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="loginstyle.css">

</head>
<body>

<div class="box shadow p-3 mb-5 bg-white rounded">
    <div class="container">
        <div class="img">
            <img class="logo" src="img/default-monochrome-white.svg" alt="">
            <img src="img/schedule.svg" alt="">
        </div>
        <div class="loginBox">
            <form class=""
                  action="login.php"
                  method="post">

                <img class="avatar" src="img/avatar.svg" alt="">
                <h2 class="text-center">Welcome</h2>
                <?php if ($_GET['error']) {?>
                    <div class="alert alert-danger" role="alert">
                        <?=$_GET['error']?>
                    </div>
                <?php } ?>
                <div class="input-div name focus">
                    <div class="i">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <label for="input" class="form-label">Username</label>
                        <input type="text" name="username" placeholder="username" required class="form-control text-center" id="input" aria-describedby="emailHelp">
                    </div>
                </div>

                <div class="input-div pass">
                    <div class="i">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div>
                        <i class="fas fa-lock"></i>
                        <label for="input" class="form-label">Password</label>
                        <input type="password" name="password" placeholder="password" required class="form-control text-center" id="input">
                    </div>
                </div>

                <div>
                    <button type="submit" class="btn">Login</button>
                </div>

            </form>
            <?php
            if (isset($_POST['username']) && isset($_POST['password'])) {
                $username = $_POST['username'];
                $password = $_POST['password'];

                authenticate($username, $password);
            }
            ?>

        </div>
    </div>
</div>


</body>

</html>