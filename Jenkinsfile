pipeline {
  agent any

  environment {
    REMOTE_HOST = "REMOTE_SERVER_IP"
    REMOTE_USER = "ubuntu"
    APP_DIR = "/var/www/expense-tracker"
  }

  stages {

    stage('Checkout') {
      steps {
        git 'https://github.com/swati-zampal/Expense-Tracker-App.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Deploy to Remote Server') {
      steps {
        sshagent(['remote-server-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
              mkdir -p ${APP_DIR}
            '

            rsync -avz --delete ./ ${REMOTE_USER}@${REMOTE_HOST}:${APP_DIR}

            ssh ${REMOTE_USER}@${REMOTE_HOST} '
              cd ${APP_DIR}
              npm install
              pm2 stop expense-tracker || true
              pm2 start app.js --name expense-tracker
              pm2 save
            '
          """
        }
      }
    }
  }
}
