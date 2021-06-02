<!--//--><?php
include "server.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<body>
    <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;" >
        <form class="p-5 rounded shadow"

              action="authenticate.php"
              method="post"
              style="width: 30rem">
            <h1 class="text-center pb-5 display-4">Scheduler</h1>
            <?php if ($_GET['error']) {?>
            <div class="alert alert-danger" role="alert">
                <?=$_GET['error']?>
            </div>
            <?php } ?>
            <div class="mb-3">
                <label for="inputName" class="form-label">Username</label>
                <input type="text" name="username" placeholder="username" class="form-control" id="inputName" aria-describedby="username">
            </div>
            <div class="mb-3">
                <label for="inputPassword" class="form-label">Password</label>
                <input type="password" name="password" placeholder="password" class="form-control" id="inputPassword">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 24rem">Sign in</button>
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

</html>