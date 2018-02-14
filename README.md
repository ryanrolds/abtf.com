# Amazing But True Facts

A personal project I use to try out new technologies. The goal of this project is to create a "fact or not" like service. Random people can submit "facts", which other people will vote on. The goal is to create true "facts" that people believe are false or false "facts" that people are true. Points will be awareded based on the spread. 

## Install

Requires Node.js and Redis (will replace with a another datastore later).

    $ make install
    $ cd data
    $ node data_import.js
    $ cd ..
    $ make start
