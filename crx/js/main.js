(function main() {
    let beginBtn = document.createElement('a')
    beginBtn.innerText = '开始抓取';
    beginBtn.id = "mp_begin";
    beginBtn.href = 'javascript:weixin.begin()';
    beginBtn.className = 'weui_btn weui_btn_plain_primary';
    beginBtn.style.width = '6em'
    beginBtn.style.zIndex = '1000'
    beginBtn.style.backgroundColor = '#FFF'
    
    let stopBtn = document.createElement('a')
    stopBtn.innerText = '停止抓取';
    stopBtn.id = "mp_stop";    
    stopBtn.href = 'javascript:weixin.stop()';
    stopBtn.className = 'weui_btn weui_btn_plain_primary';
    stopBtn.style.position = 'fixed';
    stopBtn.style.top = '1em';
    stopBtn.style.right = '1em'
    stopBtn.style.width = '6em'
    stopBtn.style.zIndex = '1000'
    stopBtn.style.backgroundColor = '#FFF'
    stopBtn.style.display = 'none'
    
    let downloadBtn = document.createElement('a')
    downloadBtn.innerText = '下载数据';
    downloadBtn.id = "mp_download";    
    downloadBtn.href = 'javascript:weixin.save()';
    downloadBtn.className = 'weui_btn weui_btn_plain_primary';
    downloadBtn.style.position = 'fixed';
    downloadBtn.style.top = '1em';
    downloadBtn.style.left = '1em'
    downloadBtn.style.width = '6em'
    downloadBtn.style.zIndex = '1000'
    downloadBtn.style.backgroundColor = '#FFF'
    downloadBtn.style.display = 'none'

    var buttonClass = 'js_operator'
    document.getElementById(buttonClass).appendChild(beginBtn)
    document.getElementById(buttonClass).appendChild(stopBtn)
    document.getElementById(buttonClass).appendChild(downloadBtn)
    document.getElementById(buttonClass).style.display = "block";
    document.getElementById('js_btn_view_profile').style.display = "none";
    
    let script = document.createElement('script');
    script.innerHTML = `
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
    `
    document.body.appendChild(script);
})()