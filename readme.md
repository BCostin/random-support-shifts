## Install
Make sure you remove previous clones to avoid strange things

git clone https://github.com/BCostin/random-support-shifts.git

## Run
yarn install && yarn start 

or 

npm install && npm run start

## Usage
* Step 1 - Press Random Pick button (just displays next 2 humans but does not save them)
* Step 2 - Press Save for {support-date} button 

* Step 3 Optional
    * Press Reset Db button to reset the database.

## Other
* Current Support Period is displayed near 'Reset Db' button
    * 1 Support Period == 2 weeks

* About the wheel:
    * It's round
    * A full spin happens when it reaches 10 Support Days (Working days) aka 1 Support Period

## Validating Support Shifts
* Fast-Add until your reach 'Support Period 2 Full' then Stop
* Check that each human has:
    - 2 total shifts in every Period
    - 4 total shifts (in 4 weeks)
    - none of them consecutive (not even between Support Periods)
    - use browser search (CTRL + F) and highlight desired name
