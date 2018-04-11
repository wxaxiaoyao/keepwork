#!/bin/bash

start_server(){
	node app.js &
}

stop_server(){
	pid=`ps uax | grep -e "node app.js" | grep -v grep | awk '{print $2}'`
	if [ ! -z $pid ]; then
		kill -9 $((pid))
	fi
}

restart_server(){
	stop_server 
	start_server
}

monitor() {
	#local monitor_dir="statics controller model npl_packages index.lua config.lua"
	local monitor_dir="."
	local last_exec_time=$((`date '+%s'`))
	inotifywait --exclude '(part|swx|swp|txt|sh|db|db-shm|db-wal|~)$' -mrq -e modify $monitor_dir | while read line
	do
		local current_time=$((`date '+%s'`))
		let time=current_time-last_exec_time
		last_exec_time=$current_time

		if [[ $time -gt 1 ]]; then
			echo "restart webserver..."
			restart_server
		#else
			#echo "less time"
		fi
	done
}

main(){
	if [ "$1" == "start" ]; then
		echo "start webserver..."
		start_server 
	elif [ "$1" == "stop" ]; then
		echo "stop webserver"...
		stop_server 
	elif [ "$1" == "restart" ]; then
		echo "restart webserver..."
		restart_server 
	elif [ "$1" == "monitor" ]; then
		echo "start monitor..."
		monitor
	else
		echo "restart webserver..."
		restart_server 
	fi
}

main $@

