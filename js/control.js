let count = 10;
let total = 0;
let mp_data = []
class weixin {
    static begin() {
        console.log('Begin catch');
        mp_data = [];
        document.getElementById('mp_download').style.display = '';
        document.getElementById('mp_stop').style.display = '';
        weixin.hook();
        weixin.push(weixin.analtyticAll(document));
        weixin.next();
    }

    static hook() {
        document.getElementById('js_history_list').oldinsertBefore = document.getElementById('js_history_list').insertBefore
        document.getElementById('js_history_list').insertBefore = function (newnode, existingnode) {
            let node = this.oldinsertBefore(newnode, existingnode)
            if (node.getElementsByClassName && node.getElementsByClassName('weui_media_box'))
                weixin.push(weixin.analtyticAll(node));
            return node;
        }
    }

    static stop() {
        document.getElementById('js_history_list').insertBefore = document.getElementById('js_history_list').oldinsertBefore;
        weixin.save();
        document.getElementById('mp_download').style.display = 'none';
        document.getElementById('mp_stop').style.display = 'none';
        window.scroll(0, 0);
    }

    static next() {
        count = 10;
        window.scroll(0, document.body.scrollHeight);
        if (!document.getElementsByClassName('js_no_more_msg')[0].style.display) {
            setTimeout(weixin.done, 2000);
        }
    }

    static done() {
        weixin.save();
        alert("抓取完成！")
    }

    static push(data) {
        mp_data = mp_data.concat(data);
    }

    static save() {
        weixin.download('data.json', JSON.stringify(mp_data));
    }

    static analtyticAll(ele) {
        let data = [];
        Array.from(ele.getElementsByClassName('weui_media_box')).forEach(function (ele) {
            let d = weixin.analtytic(ele);
            if (d) data.push(d);
        });
        if (--count <= 0) {
            let offset = 1000;
            if (++total == 50) {
                total = 0;
                offset = 120000
            }
            setTimeout(weixin.next, offset);
        }
        if (!document.getElementsByClassName('js_no_more_msg')[0].style.display) {
            setTimeout(weixin.done, 2000);
        }

        return data;
    }

    static analtytic(ele) {
        if (!ele.getElementsByClassName('weui_media_title')[0] ||
            !ele.getElementsByClassName('weui_media_extra_info')[0] ||
            !ele.getElementsByClassName('weui_media_hd')[0]
        ) return null;
        let link = ele.getAttribute("hrefs");
        let sn = link.match(/&sn=([^&]*?)&/)[1];
        let title = ele.getElementsByClassName('weui_media_title')[0].innerText;
        let date = ele.getElementsByClassName('weui_media_extra_info')[0].innerText.replace(/原创/g, '')
        let img = ele.getElementsByClassName('weui_media_hd')[0].style.backgroundImage;
        img = img && img.match(/(http[^"]*?)(?=")/g);
        img = img && img[0];
        return {
            title: title,
            link: link,
            date: date,
            img: img
        }
    }

    static download(fileName, content) {
        var aTag = document.createElement('a');
        var blob = new Blob([content]);
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
    }
}