<?php
include "server.php";
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Scheduler Login page</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="loginstyle.css">
    <script type="text/javascript" src="loginJavascript.js"></script>



</head>
<body>

    <div class="container shadow p-3 mb-5">
        <div class="img" id="loginImage" style="display: none">
            <img class="logo" src="img/default-monochrome-white.svg" alt="">
            <img src="img/schedule.svg" alt="" id="schedule">
        </div>
        <div class="loginBox" style="display: none" id="loginPageLoginBox">
            <form class=""
                  action="login.php"
                  method="post">

                <img class="avatar" src="img/avatar.svg" alt="">
                <h2 class="text-center">Welcome</h2>


                <div id="inputsDiv">
                    <div id="loginAlert" class="alert alert-danger" role="alert" style="display: none">
                        <?=$_GET['error']?>
                    </div>
                    <div class="input-div name focus">
                        <div class="i">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <label for="input" class="form-label">Username</label>
                            <input type="text" name="username" placeholder="username" required class="form-control text-center" id="inputUsername" >
                        </div>
                    </div>

                    <div class="input-div pass">
                        <div class="i">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div>
                            <i class="fas fa-lock"></i>
                            <label for="input" class="form-label">Password</label>
                            <input type="password" name="password" placeholder="password" required class="form-control text-center" id="inputPassword">
                        </div>
                    </div>
                </div>
                <div id="buttonDiv">
                    <button type="submit" class="btn">Login</button>
                </div>
                <?php if (!$_GET['error']) {?>
                    <script>
                        pageFirstLoad();
                    </script>
                <?php } else {?>
                    <script>
                        incorrectLogin();
                    </script>
                <?php } ?>








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



</body>

</html>