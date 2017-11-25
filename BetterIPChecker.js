var linkToInject = '<span class="pull-right hide-phone"><a href="javascript:void(0)" id="ipCheckLink">Check IP\'s</a></span>';
var inputModal = '<div class="fade modal"role=dialog id=inputModal tabindex=-1><div class=modal-dialog role=document><div class=modal-content><div class=modal-header><button class=close type=button data-dismiss=modal aria-label=Close><span aria-hidden=true>×</span></button><h4 class=modal-title>Check IP\'s (made by <a href="https://legacy.hackerexperience.com/profile?id=510033"target=_blank>Jasperr</a>)</h4></div><form id=inputForm><div class=modal-body><div class=form-group><label class=control-label for=ipInput>Please input your IP\'s below, one per line and it will give you back all existing VPC\'s and Clan IP\'s.</label><textarea class=form-control id=ipInput placeholder="Place your IP\'s here"rows=10 style=min-width:90%></textarea></div></div><div class=modal-footer><span class="label label-info" id="amountRsc" style="margin-left: 50px;"></span><button class="btn btn-default"type=button data-dismiss=modal>Close</button> <button class="btn btn-primary"type=submit id=inputSubmitButton>Check my IP\'s</button></div></form></div></div></div>';
var isChecking = false;
var totalChecked = 0;
var totalIPsToCheck = 0;
var nonExisting = 0;
var NPCs = [];
var VPCs = [];
var ClanServers = [];
var errors = [];
var IPsToCheck = [];

function gritterNotify(opts) {
    alert(opts.text);
}

function validateIP(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return true;
    }
    return false;
}

function isLoggedIn() {
    if ($('a[href="logout"]').length) {
        return true;
    }
    return false;
}

function bindLinkEvent() {
    $('#ipCheckLink').click(function(event) {
        ipCheckLinkClick(event);
    });
}

function unbindLinkEvent() {
    $('#ipCheckLink').off('click');
}

function ipCheckLinkClick(event) {
    $('#inputModal').modal('show');
    $(".modal-backdrop").removeClass("modal-backdrop");
}

function checkIPs(ipArray) {
    if (!isChecking) {
        isChecking = true;
        totalChecked = 0;
        nonExisting = 0;
        NPCs = [];
        VPCs = [];
        ClanServers = [];
        errors = [];

        totalIPsToCheck = ipArray.length;
        IPsToCheck = ipArray;
        totalAmount = ipArray.length;

        checkIPArray();
    }
}

function checkIPArray() {
    if (totalChecked == totalIPsToCheck) {
        finishSubmit();
        return;
    }

    var ip = IPsToCheck[0];
    IPsToCheck.splice(0, 1);

    $.ajax({
       url: "https://legacy.hackerexperience.com/internet?ip=" + ip,
        type: "GET",
        success: function(data) {
            if ($('.widget-content:contains("404")', data).length) {
                nonExisting++;
            } else {
                var type = $('.label.pull-right', data).text();

                switch (type) {
                    case 'NPC':
                        NPCs.push(ip);
                        break;
                    case 'VPC':
                        VPCs.push(ip);
                        break;
                    case 'Clan Server':
                        ClanServers.push(ip);
                        break;
                    default:
                        NPCs.push(ip);
                }
            }

            totalChecked++;
            $("#amountRsc")[0].innerText = totalChecked + "/" + totalAmount;
            checkIPArray();
        },
        error: function(data){
            errors.push(ip);
            totalChecked++;
            checkIPArray();
        }
    });
}

function submitInput() {
    $('#inputSubmitButton').prop('disabled', true);
    $('#inputSubmitButton').text('Working on it');

    var IPs = $('#ipInput').val().split('\n');

    var IPs = IPs.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });

    var validIPs = [];

    $.each(IPs, function(index, value) {
        if (validateIP(value)) {
            validIPs.push(value);
        }
    });

    var amount = validIPs.length;

    if (amount == 0) {
        gritterNotify({
            title: 'HE IP Checker',
            text: 'You didn\'t input any IP\'s or all your IP\'s were invalid.',
            image: '',
            sticky: false
        });

        $('#inputSubmitButton').prop('disabled', false);
        isChecking = false;
        $('#inputSubmitButton').text('Check my IP\'s');

        return;
    }

    if (amount > 2500) {
        gritterNotify({
            title: 'HE IP Checker',
            text: 'You can only check 2500 IP\'s at a time.',
            image: '',
            sticky: false
        });

        $('#inputSubmitButton').prop('disabled', false);
        isChecking = false;
        $('#inputSubmitButton').text('Check my IP\'s');

        return;
    }

    checkIPs(validIPs);
}

function finishSubmit() {
    var text = 'Checked ' + totalIPsToCheck + ' IP\'s of which ' + nonExisting + ' didn\'t exist. There were ' + NPCs.length + ' NPC\'s, ' + VPCs.length + ' VPC\'s, ' + ClanServers.length + ' Clan servers and ' + errors.length + " Error Cases";
    if(errors.length > 0){
        text += '\n\nError IP\'s (' + errors.length + ')\n\n';
        text += errors.join('\n');
    }
    if (NPCs.length > 0) {
        text += '\n\nNPC IP\'s (' + NPCs.length + ')\n\n';
        text += NPCs.join('\n');
    }
    if (VPCs.length > 0) {
        text += '\n\nVPC IP\'s (' + VPCs.length + ')\n\n';
        text += VPCs.join('\n');
    }
    if (ClanServers.length > 0) {
        text += '\n\nClan Server IP\'s (' + ClanServers.length + ')\n\n';
        text += ClanServers.join('\n');
    }

    $('#ipInput').val(text);
    $('#inputSubmitButton').prop('disabled', false);
    isChecking = false;
    $('#inputSubmitButton').text('Check my IP\'s');
}

$(document).ready(function() {
    if (isLoggedIn()) {
        $('#breadcrumb').append(linkToInject);
        $('body').append(inputModal);

        $('#inputForm').submit(function(event) {
            event.preventDefault();
            submitInput();
        });

        bindLinkEvent();
    }
});