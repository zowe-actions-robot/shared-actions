/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright IBM Corporation 2021
 */

const core = require('@actions/core')
const { utils } = require('zowe-common')

var user = core.getInput('user')
var repo = core.getInput('github-repo')
var g_token = core.getInput('github-token')

// null check
utils.mandatoryInputCheck(user,'user')
utils.mandatoryInputCheck(repo,'github-repo')
utils.mandatoryInputCheck(g_token,'github-token')

if (user == 'dependabot[bot]'){
    console.log(`${user} is running this workflow now, manually approved - Bypassing permission check`)
}
else {
    var cmds = new Array()
    cmds.push(`curl`)
    cmds.push(`-H "Accept: application/vnd.github.v3+json"`)
    cmds.push(`-H "Authorization: Bearer ${g_token}"`)
    cmds.push(`-X GET`)
    cmds.push(`"https://api.github.com/repos/${repo}/collaborators/${user}/permission"`)
    cmds.push(`| jq -r .permission`)
    var returnedPermission = utils.sh(cmds.join(' '))
    console.log(`Returned permission is ${returnedPermission}`)
    if (!returnedPermission || (returnedPermission != 'admin' && returnedPermission != 'write' && returnedPermission != 'maintain')) {
        core.setFailed(`Permission check failure, user ${user} is not authorized to run workflow on ${repo}, permission is ${returnedPermission}`)
    }
}