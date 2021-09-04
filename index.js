(function() {

// you can use constants for common values:
const owner = 'my-account',
      repo  = `my-repo`,
      issue_id = 123
;
/*
 * Change the values below to whatever you want
 */
const outputs = {
    /* will set this key...       ... to this value */
    "maintenance-window-start"   : "2020-01-01T00:00:00Z",
    "maintenance-window-duration": 60*60 * 1000, // one hour
    "maintenance-url"            : `https://github.com/${owner}/${repo}/issues/${issue_id}`,
    "maintenance-steps"          : [
        { // each step consists of several actions, executed in parallel:
            title: `First step`,
            actions: [
                {
                    // add a comment to an issue
                    action: `add_comment`,
                    id: issue_id,
                    // the constants above can be used as shorthand property names:
                    owner,
                    repo,
                    // the message body can contain fields that will be filled in automatically:
                    body: `Message body\n{{field1}}\n{{field2}}`,
                    fields: [
                        {
                            label: `Field 1`,
                            id: `field1`,
                            type: `switch`,
                            on: `on-value`,
                            off: `off-value`,
                            value: false,
                        },
                        {
                            label: `Field 2`,
                            id: `field2`,
                            type: `textarea`,
                            value: ``,
                        },
                    ],

                },
                {
                    // enable a workflow
                    action: `enable_workflow`,
                    owner,
                    repo,
                    id: `maintenance-timer.yml`,
                },
                {
                    // create a branch
                    action: `create_branch`,
                    source: `main`,
                    destination: `last-known-good`,
                    owner,
                    repo,
                },
                {
                    // delete a branch
                    action: `delete_branch`,
                    name: `maintenance`,
                    owner,
                    repo,
                },
                { // reminder to manually check a site is working
                    action: `check_site`,
                    title: `GitHub Status`,
                    url: `https://www.githubstatus.com/`,
                    comment: `Should be 'All Systems Operational'`,
                },
            ],
        },
        {
            title: "Second step",
            actions: [
                { // accept a pull request
                    action: `accept_pr`,
                    owner,
                    repo,
                    id: 123,
                },
                { // trigger a workflow and wait for it to finish
                    action: `run_workflow`,
                    owner,
                    repo,
                    id: `maintenance.yml`,
                },
                { // wait for a workflow to finish that was triggered some other way
                    action: `wait_for_workflow`,
                    owner,
                    repo,
                    id: `maintenance-checks.yml`,
                },
            ],
        },
        ...
    ],
};

// Do not edit below this line

(
    globalThis.handle_data
    ? globalThis.handle_data
    : data => {
        Object.keys(data).forEach( key => console.log( `::set-output name=${key}::${data[key]}` ) );
        Object.keys(data).forEach( key => console.log( `${key}: ${data[key]}` ) );
    }
)(data);

})();
