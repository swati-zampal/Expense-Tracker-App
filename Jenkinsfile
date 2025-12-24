pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/Swatiz-cloud/Expense-Tracker-App.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Deploy') {
      steps {
        sh 'pm2 stop expense-tracker || true'
        sh 'pm2 start app.js --name expense-tracker'
      }
    }
  }
}
