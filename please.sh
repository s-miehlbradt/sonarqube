#!/bin/bash
# "please" is our script launcher script
# put new scripts in the ./scripts folder and you're set

action=$1
SCRIPT_PATH=$(dirname $0)
scriptfolder="${SCRIPT_PATH}/scripts"

# Usage
#
if [ ! -f "$scriptfolder/$action" ]; then
	echo -e "Usage: ./please.sh ACTION\n\nDon't know what to do with action '$action'. Try one of those instead:"

	LIST=""
	for entry in `ls $scriptfolder/`; do
		DESCRIPTION=`sed -n '2p' $scriptfolder/$entry | sed -e 's/.*description:[ ]*//g'`

		LIST="${LIST}- $entry\t${DESCRIPTION}\n"
	done

	echo -e $LIST | column -t -c 2 -s $'\t'

	exit -1
fi

# Run script
#
"$scriptfolder/$action" ${*:2}
