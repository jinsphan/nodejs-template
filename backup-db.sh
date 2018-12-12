sudo mongodump --db $1 --out /var/backups/mongobackups/$2
#sudo zip -r /var/backups/mongobackups/$2/$3.zip /var/backups/mongobackups/$2/$1