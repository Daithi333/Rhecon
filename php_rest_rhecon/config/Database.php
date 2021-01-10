<?php

  class Database {

    public function connect() {
      require_once 'secure.php';
      $this->conn = null;

      try {
        $this->conn = new PDO('mysql:host=' . $host . ';dbname='. $db_name, $username, $password);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      } catch(PDOException $ex) {
        echo 'Connection Error: ' . $ex->getMessage();
      }

      return $this->conn;
    }
      
  }