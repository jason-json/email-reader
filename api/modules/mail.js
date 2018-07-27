const Imap = require('imap'),
    inspect = require('util').inspect;
const user = require('./config.json');
var fs = require('fs'), fileStream;
const MailParser = require("mailparser").MailParser;

module.exports = {
    unreadMail: (res) => {
        let parser = new MailParser();
        let imap = new Imap({
            user: user.usermail.username,
            password: user.usermail.userpassword,
            host: 'imap.gmail.com',
            port: 993,
            tls: true
        });

        openInbox = (cb) => {
            imap.openBox('INBOX', true, cb);
        }
        imap.once('ready', function () {
            openInbox(function (err, box) {
                if (err) throw err;
                imap.search(['UNSEEN', ['SINCE', 'May 20, 2018']], function (err, results) {
                    if (err) throw err;
                    var f = imap.fetch(results, { bodies: '' });
                    f.on("message", processMessage);
                    // f.on('message', function (msg, seqno) {
                    //     console.log('Message #%d', seqno);
                    //     var prefix = '(#' + seqno + ') ';
                    //     msg.on('body', function (stream, info) {
                    //         // console.log(prefix + 'Body');
                    //         // stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                    //         stream.on("data", function (chunk) {
                    //             console.log(parser.write(chunk.toString("utf8")));
                    //         });
                    //     });
                    //     msg.once('attributes', function (attrs) {
                    //         // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    //     });
                    //     msg.once('end', function () {
                    //         console.log(prefix + 'Finished');
                    //     });
                    // });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });
        });

        function processMessage(msg, seqno) {
            var parser = new MailParser();
            parser.on("headers", function (headers) {
                console.log("Header: " + JSON.stringify(headers));
            });

            parser.on('data', data => {

                console.log("\n\n\n\n<<<<<<<<<<<<<<<<<");
                console.log(data.type);
                console.log(">>>>>>>>>>>>>>>>>>\n\n\n\n");

                // if (data.type === 'text') {
                //     console.log("<<<<<<<<<<<<<<<<<");
                //     console.log("****** "+"Processing msg #" + seqno+"\n");
                //     console.log(data.text);  /* data.html*/
                //     console.log("Finished msg #" + seqno);
                //     console.log("Finished msg #" + seqno+" ******");
                //     console.log(">>>>>>>>>>>>>>>>>>\n\n");

                // }


              
            });

            msg.on("body", function (stream) {
                stream.on("data", function (chunk) {
                    parser.write(chunk.toString("utf8"));
                });
            });
            msg.once("end", function () {
                
                parser.end();
            });
        }
        imap.once('error', function (err) {
            console.log(err);
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();

    }

};

