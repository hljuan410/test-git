var _sgaq = window._sgaq || []
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}


function closest(node, attr) {
    // var result = node.getAttribute(attr);
    var result = node.dataset[attr];
    if (result) {
        return result;
    }
    var parent = node.parentNode;
    if (parent && parent.nodeType === 9) {
        return 'other';
    }
    if (parent && parent.nodeType === 1) {
        return closest(parent, attr);
    }
}



function offset(node) {
    var rect = node.getBoundingClientRect();
    var docElement = document.documentElement;
    return {
        top: rect.top + window.pageYOffset - docElement.clientTop,
        left: rect.left + window.pageXOffset - docElement.clientLeft
    }
}
// according to the MDN docs:
// The Object constructor creates an object wrapper for the given value.
// If the value is null or undefined, it will create and return an empty object, 
// otherwise, it will return an object of a type that corresponds to the given value.
// If the value is an object already, it will return the value.
function isObject(o) {
    return o === Object(o);
}

function params(o) {
    if (!o || !isObject(o)) {
        return '';
    }
    var keys = Object.keys(o);
    if (!keys.length) {
        return '';
    }
    var encode = encodeURIComponent;
    return keys.map(function (item) {
        // if (isObject(o))
        return encode(item) + '=' + encode(o[item]);
    }).join('&');
}

var util = {
    pbflag: function (node) {
        return closest(node, 'pbflag');
    },
    pbtab: function (node) {
        return closest(node, 'pbtab');
    },
    pburl: function (node) {
        return node.href || '';
    },
    urlname: function (node) {
        return node.querySelector('img') && node.querySelector('img').getAttribute('src') || '';
    },
    text: function (node) {
        return (node.innerText || this.urlname(node)).replace(/\s/g, '');
    },
    offset: function (node) {
        var _offset = offset(node);
        return _offset.left + '-' + _offset.top;
    },
    link_type: function (node) {
        return /sogou\.com/.test(this.pburl(node)) ? 'link' : 'outlink';
    },
    outlink_host: function (node) {
        var url = (this.pburl(node) || '').match(/http:\/\/([\w\.]+)\b/)
        return url ? url[1] : ''
    }
}

var handler = function (target, param) {
    // var target = event.currentTarget;
    // options
    var pbtab = target ? util.pbtab(target) : '';
    var urlname = target ? util.urlname(target) : '';
    var outlink_host = target ? util.outlink_host(target) : '';
    var text = target ? util.text(target) : '';
    var pos = target ? util.offset(target) : '0_0';
    // 独立参数
    var link_type = target ? util.link_type(target) : 'link';
    var pbflag = target ? util.pbflag(target) : 'other';
    var pburl = target ? util.pburl(target) : 'null';

    var options = Object.assign({
        pbtab: pbtab,
        urlname: urlname,
        outlink_host: outlink_host,
        text: text,
        pos: pos
    }, param || {});

    // console.log('~~~~~~~~~tj click params ~~~~~~~~~~~')
    // console.log(decodeURIComponent(params(options)));
    // console.log(link_type);
    // console.log(pbflag);
    // console.log(pburl);
    // console.log('~~~~~~~~~tj click params ~~~~~~~~~~~')

    _sgaq.push(['_trackEvent', link_type, pbflag, pburl, params(options)]);
}


// 对外自定义发统计

// 执行
document.addEventListener('click', function (event) {
    // console.log('~~~~~~~~~~~from tj.js~~~~~~~')
    // debugger;
    var target = event.target;
    var currentTarget = event.currentTarget;
    // console.log(target.nodeName + '~~~~' + event.currentTarget.nodeName);

    while (target !== currentTarget) {
        // console.log(target.nodeName);
        if (target.nodeName === 'A') {
            // console.log('~~~~~~~~~~~from A TAG tj.js~~~~~~~')
            handler.call(null, target);
            return true;
        }
        target = target.parentNode;
    }
}, false);

_sgaq.push(['_setPcode', spb_vars.pcode]);
_sgaq.push(['_setAccount', spb_vars.ptype]);
_sgaq.push(['_trackPageview']);

// //upd10.sogoucdn.com/nstatic/js/sa_v1.0.3.js