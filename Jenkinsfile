pipeline {
    agent {label '132'}
    stages {
        stage('preperation') {
            steps {
                sh 'npm install'
                sh 'npm run preperation:linux'
            }
        }
        stage('build server') {
            steps {
                sh 'id'
                sh 'npm run build_server'
            }
        }
        stage('build web') {
            steps {
                sh 'npm run build_web'
            }
        }
        stage('deploy') {
            steps {
                sh 'npm run deploy:linux'
                sh 'chmod 777 target/o2server/*.sh'
            }
        }
        stage('run') {
            steps {
                sh 'target/o2server/start_linux.sh'
            }
        }
    }
}
