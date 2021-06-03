<?php
include "server.php";
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login page</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body id="loginPage">
<div id="loginBox" class="d-flex justify-content-center align">
    <form class=""
          action="login.php"
          method="post"
          style="width: 30rem">
        <h1 class="text-center pb-5 display-4">LOGIN</h1>
        <?php if ($_GET['error']) {?>
        <div class="alert alert-danger" role="alert">
            <?=$_GET['error']?>
            <?php } ?>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Username</label>
                <input type="text" name="username" placeholder="username" required class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" name="password" placeholder="password" required class="form-control" id="exampleInputPassword1">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <?php
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        authenticate($username, $password);
    }
    ?>


</div>
</body>
</body>

</html>