function loadScripts( src, callback ) {
    var script = document.createElement("SCRIPT"),
        head = document.getElementsByTagName( "head" )[ 0 ],
        error = false;

    script.type = "text/javascript";

    script.onload = script.onreadystatechange = function( e ){

        if ( ( !this.readyState || this.readyState == "loaded" || this.readyState == "complete" ) ) {
            if ( !error ) {
                removeListeners();
                callback( true );
            } else {
                callback( false );
            }
        }
    };

    script.onerror = function() {
        error = true;
        removeListeners();
        callback( false );
    }

    function errorHandle( msg, url, line ) {

        if ( url == src ) {
            error = true;
            removeListeners();
            callback( false );
        }
        return false;
    }

    function removeListeners() {
           script.onreadystatechange = script.onload = script.onerror = null;

        if ( window.removeEventListener ) {
            window.removeEventListener('error', errorHandle, false );
        } else {
            window.detachEvent("onerror", errorHandle );
        }
    }

    if ( window.addEventListener ) {
        window.addEventListener('error', errorHandle, false );
    } else {
        window.attachEvent("onerror", errorHandle );
    }

    script.src = src;
    head.appendChild( script );
}
//---------------
var param = (function() {
    
    var objRes   = {};
    var strQuery=window.location.search;        
    var i,
        tmp     = [],
        tmp2    = [];
    if (strQuery != '') {
        tmp = (strQuery.substr(1)).split('&');
        for (i = 0; i < tmp.length; i += 1) {
            tmp2 = tmp[i].split('=');
            if (tmp2[0]) {
                objRes[tmp2[0]] = tmp2[1];
            }
        }
    }    
    return objRes;
})();

//----------------------
var scrPath = (function() {
    var s = document.getElementsByTagName('script');
    var p = s[s.length-1].src;
    return  p.substr(0,p.lastIndexOf('/')+1);
})();
//----------------------
var csr00="font-size:100%;color:#800000;width:500px;height:600px;position: fixed;top:expression(eval(document.documentElement.scrollTop)+20);top:0px;right:0;z-index:1;";
var csl00="font-size:100%;color:#800000;width:500px;height:600px;position:fixed;top:expression(eval(document.documentElement.scrollTop)+20);top:3px;left:0;z-index:1;";
var csj00="width:100%;height: 100%;position: fixed;top: 0;left:0;display:flex;align-items:center;justify-content:center;overflow:auto;";
var bd00;
var bdXX;
var tab00; 
var wop00,wop01_i=-1;
var wop01;
var edt00=false;
var sel00=false;
var sel_auto00=false;
var sel_vkl00=false;
var run00=false;
var addr00='';

function theKey(b)
{
  if (typeof(b.k)=='string')
  {
      return b.k;  
  }
  var pth=b.l;
  var i=pth.indexOf("//");
  var j=pth.indexOf("/",i+2);
  if (j>i) pth=pth.substr(i+2,j-i-2); else pth=pth.substr(i+2);
  return pth;
}
function numOpen()
{
    if (wop00!==undefined) 
    {
     if (!(wop00.closed))
     {  
      return wop00.i;
     }
    }
    if (wop01!==undefined) 
    {
      if (!(wop01.closed))
      {
       return wop01_i;
      } 
    }
 return -1;    
}
function chkRunStop()
{
 var s,b=document.getElementById('btn_run');
 if (numOpen()<0) {s='Начать ротацию';run00=false;} else { s='Завершить ротацию';run00=true;}
 b.title=s;b.innerHTML='<b>'+s+'</b>';
}
function chkLnk()
{
    var d = new Date();
    var iop = numOpen();    
    bdXX.forEach(function(item, i, arr) 
    {
      var dt = Math.round((d-item.d)/(1000));
      var mn = Math.floor(dt/60);
      var sc = dt-mn*60;
      var s="";
      var dz;
      if (mn<bd00[i].t)
      {
       s="red";dz="disabled>";
       if (iop==i) dz+="<b>O</b>";
              else dz+="X";
       item.ok=false;
      } else
      {
       s="green";dz=">V";       
       item.ok=true;
      }
      s="<font color='"+s+"'>";      
      if (sc<10) sc='0'+sc;      
      s=s+mn+":"+sc+"</font>";
      if ((!item.rot) && ((item.win!=undefined) && (!item.win.closed)))
      {        
	   dz="<button onclick='bDbClk("+i+");'><b>R</b></button>";        
       s="<b>"+s+"</b>";
      } else
      {
        dz="<button onclick='oFrame("+i+");' "+dz+"</button>";
      }
      item.td.innerHTML=dz+s;
    });    
}

function myWindowClose() 
{
  if (wop00!==undefined) 
  {
   wop00.close();   
  }  
}
function funNext(j)
{    
  var nm,ii=1;
  while ((ii<tab00.rows.length) && (tab00.rows[ii].idx!=j)) ii++;
  var fp=-1,fi=-1,f=ii;  
  while(true)
  { 
    ii++;  
    if (ii>=tab00.rows.length) ii=1;
    if (ii==f) 
    {
     if (fi==-1) return true;     
     oFrame(fi);break;
    }
    nm=tab00.rows[ii].idx;
    if ((nm>=0) && (bdXX[nm].rot) && (bdXX[nm].ok))
    {
     if (sel00)
     {   
      if (fp<bd00[nm].p) {fp=bd00[nm].p;fi=nm;}
     } else
     {
       oFrame(nm);break;  
     }
    }    
  }
  return false;
}
function funRun()
{    
  var fp=-1,fi=-1;
  var nm,ii=0;    
  while (ii<tab00.rows.length-1)
  { 
    ii++;      
    nm=tab00.rows[ii].idx;        
    if ((nm>=0) && (bdXX[nm].rot) && (bdXX[nm].ok))
    {
     if (sel00)
     {   
      if (fp<bd00[nm].p) {fp=bd00[nm].p;fi=nm;}
     } else
     {
       fi=nm;break;
     }
    }    
  }
  if (fi==-1) return true;
  oFrame(fi);
  return false;
}

function createWin(i) 
{
  var w,nw;  
  if (bdXX[i].rot)
  {  
   nw='w2'+addr00;   
  } else
  {
   if (typeof(bdXX[i].win)!='undefined')
   {   
    if (!(bdXX[i].win.closed))
    {
      bdXX[i].win.focus();
      return false;  
    }  
   }   
   nw='w'+addr00+bdXX[i].key;    
  }
  //w = window.open(bd00[i].l, nw, 'scrollbars=1,fullscreen=yes,status=yes,toolbar=no,menubar=no'); 
  w = window.open(bd00[i].l, nw); 
  bdXX[i].win=w;
  if (bdXX[i].rot)
  {
   wop01=w;wop01_i=i;
  }
  w.focus();  
  return true;
}
function funNextKran()
{ 
 sel_vkl00=true;
 if (run00)
 {
  if (funNext(numOpen())) 
  {
    if ((wop01!==undefined) && (!(wop01.closed))) 
    {
        wop01.close();         
    }
    wop00.close();
  } 
 } else
 {
  funRun();
 } 
}
function createFrame(i) 
{
 var w,nw;
 if (bdXX[i].rot)
 {
  if ((wop01!==undefined) && (!(wop01.closed))) wop01.close();
  nw='w'+addr00;   
 }  else 
 {
  if (typeof(bdXX[i].win)!='undefined')
  {   
    if (!(bdXX[i].win.closed))
    {
      bdXX[i].win.focus();
      return false;  
    }  
  }
  nw='w'+addr00+bdXX[i].key;
 } 
 //w = window.open('', nw, 'scrollbars=1,height='+screen.availHeight+',width='+screen.availWidth); 
 w = window.open('', nw); 

 bdXX[i].win=w;
 w.i=i;
 var s='<!DOCTYPE html><html"><head><title></title></head>';
 s+='<'+'script>var tcl=false;'; 
 if (bdXX[i].rot)
 {
  wop00=w;  
  w.sopen=function()
  {      
   createWin(i);
  }
  w.fnext=function()
  {    
     if (top.funNext(wop00.i)) 
     {
       if ((wop01!==undefined) && (!(wop01.closed))) 
       {
        wop01.close();         
       }
       wop00.close();
     }   
   //  w.window.location.href=w.window.location.href;
   
  }  
  //s+='<'+'script>function next(){var v = document.getElementById("d002");v.src="";fnext();}</'+'script>';      
  s+='function topclosed(){tcl=true;}';
  s+='function next(){';
  s+='if (tcl) {alert("Вы закрыли окно управления!");myClose();}';
  s+='var v = document.getElementById("d002");v.src="";fnext();';
  s+='}';  
  //s+='function chkTop() {if (window.opener.closed) {alert(1);}';
  //s+='alert(window.location.href);';
  //s+='setInterval(chkTop,1000);';  
 } 
 s+='function myClose(){';
 s+='if (tcl) {window.open(window.location.href,"_blank");}';
 s+='close();';
 s+='}';
 s+='</'+'script>';
 w.rel=function()
 {      
  var v=w.document.getElementById('d002');
  v.src=v.src;
 }
    s+='<frameset id="fs00" rows="45,*" style="border: none;">';
    s+='<frame id="d001" name="frame_footer" src="" marginwidth="0" marginheight="0" scrolling="no" noresize="noresize" frameborder="0" />';
    s+='<frame id="d002" name="frame_site" src="" marginwidth="0" marginheight="0" frameborder="0" />';    
    s+='</frameset></html>';   
 w.document.write(s);
 var d,f = w.document.getElementById('d001');  
 (d = f.contentWindow.document).open();
 s='';
 /*
 s+='<div id=FixedElement align=center style="margin:0;overflow:hidden;border:0;padding:0px;RIGHT: 0;WIDTH:600; POSITION: absolute; Z-INDEX: 0; BOTTOM: ';
 s+='expression( (document. getElementsByTagName(\'body\')[0].scrollBottom + document.getElementsByTagName(\'body\')[0].clientHeight)-40); HEIGHT: 2em; ';
 s+='BACKGROUND-COLOR: #f5f5ea">!!!Рекламная ссылка!!!!!!</div>'; 
 */
 //s+='<div style="'+csr00+'">!!!Рекламная ссылка!!!</div>'
 s+='<div style="'+csr00+'"><iframe src="'+scrPath+'recl.html" width="400" height="40" frameborder=no></iframe></div>' 
 s+='<div style="'+csl00+'">'+bd00[i].v+'<br/>Вес:'+bd00[i].p+', Интервал:'+bd00[i].t+'мин</div>';
 //s+=bd00[i].v;
 s+='<div style="'+csj00+'">';
 if (bdXX[i].rot) 
 {
  s+='<button onclick="top.myClose();">Завершить ротацию</button>';
  if (typeof(bd00[i].i)=='undefined')     
  {
   s+='<button onclick="top.rel();">Обновить</button>';
  }
  s+='<button onclick="top.next();">Следующий</button>';
 } else
 {
  s+='<button onclick="top.rel();">Обновить</button>';   
  s+='<button onclick="top.myClose();">Закрыть</button>';   
 }
 if (localStorage.getItem(addr00)!=undefined)
 {    
  s+='<input type="text" size="8" value="'+localStorage.getItem(addr00)+'" readonly onclick="this.select();" title="Кошелек"/>';
 }
 if (bd00[i].v2!=undefined)
 {
  s+='v1:<input type="text" size="8" value="'+bd00[i].v2+'" readonly onclick="this.select(); title="Дополнительно-1"/>';   
 }
 if (bd00[i].v3!=undefined)
 {
  s+='v2:<input type="text" size="8" value="'+bd00[i].v3+'" readonly onclick="this.select();"  title="Дополнительно-2"/>';   
 }
 s+='</div>';  
 d.write(s);
 d.close();
 w.document.title = bdXX[i].key;
 var v=w.document.getElementById('d002');
 var fs=w.document.getElementById('fs00');
 fs.removeChild(v); 
 v=w.document.createElement('frame');
 v.id="d002";
 fs.appendChild(v); 
 if (typeof(bd00[i].i)=='undefined')
 {
  v.src=bd00[i].l;  
 } else
 {
  (d = v.contentWindow.document).open();  
  s='<div style="'+csj00+'">';  
  s+="Этот сайт может быть открыт только в отдельном окне";
  s+='<button onclick="top.sopen();">Открыть</button></div>';
  d.write(s);
  d.close();     
 }
 w.focus();
 return true;
}

function tmReset(i)
{
 bdXX[i].d= new Date();
 localStorage.setItem(addr00+'data_'+bdXX[i].key, bdXX[i].d.toISOString());   
}
function bDbClk(i)
{    
 tmReset(i);
 chkLnk();   
}
function oFrame(i)
{ 
 if (bdXX[i].rot)
 {
  if ((sel_auto00) || (sel_vkl00))
  {
   if (createWin(i))  bDbClk(i);   
   sel_vkl00=false;
  } else
  {
   if (createFrame(i)) bDbClk(i);
  }  
  chkRunStop();
 } else bClk(i); 
}
function bClk(i)
{  
 if (typeof(bd00[i].i)=='undefined')
 {   
   if (sel_vkl00)  
   {
    if (createWin(i))  bDbClk(i);   
    sel_vkl00=false;   
   } else
   {
    if (createFrame(i)) bDbClk(i); 
   }
 } else
 {   
   if (createWin(i))  bDbClk(i);
 }
 chkRunStop();
}
function bClk2(i)
{
   sel_vkl00=true;bClk(i); 
}
function bDel(i)
{  
 bd00[i].b=1;
 localStorage.setItem(addr00+'bd',JSON.stringify(bd));
 location.reload();
}
function bAdd()
{
  var l,v,p,t,item,s;  
  l=document.getElementById('new_l').value;
  if (l=="") return;  
  if (l.charAt(0)=='#')
  {
   if (l=="#init") 
   {
     localStorage.removeItem(addr00+'bd');
     location.reload();
   } else
   if ((l=="#o1") || (l=="#o2"))
   {    
    var w = window.open('', 'o'+addr00, 'scrollbars=1,fullscreen=yes,status=yes,toolbar=no,menubar=no');    
    if (l=="#o1")
    {
     w.document.write("var "+addr00+"="+JSON.stringify(bd));
    } else
    {
     w.document.write("var "+addr00+"="+JSON.stringify(bd00));
    }
    w.focus();
   } else   
   if (l=="#und") 
   { 
     s=0;
     while (s<bd.length)
     {
      bd[s].b=undefined;s++;   
     }
     localStorage.setItem(addr00+'bd',JSON.stringify(bd));
     location.reload();
   }   
   return;
  }
  document.getElementById('new_l').value="";
  if ((l.indexOf("http://")==-1) && (l.indexOf("https://")==-1)) l="http://"+l;
  v=document.getElementById('new_v').value;
  p=Number(document.getElementById('new_p').value);
  t=Number(document.getElementById('new_t').value);
  i=document.getElementById('new_i').checked;
  var kk=document.getElementById('new_k');
  if (kk!=undefined)
  {
   kk=kk.value;
  } else kk='';  
  var v2=document.getElementById('new_v2');
  if (v2!=undefined)
  {
   v2=v2.value;
  } else v2='';  
  var v3=document.getElementById('new_v3');
  if (v3!=undefined)
  {
   v3=v3.value;
  } else v3='';  
  
  if (isNaN(p) || (p<0)) p=0;
  if (isNaN(t) || (t<1)) t=1;
  item ={};
  item.l=l;
  item.v=v;
  item.t=t;
  item.p=p;
  if (kk!='') item.k=kk;
         else item.k=undefined;
  if (v2!='') item.v2=v2;
         else item.v2=undefined;
  if (v3!='') item.v3=v3;
         else item.v3=undefined;         
  
  if (i) item.i=1;
  
  document.getElementById('new_v').value="";  
  document.getElementById('new_p').value="";
  document.getElementById('new_t').value="";
  document.getElementById('new_i').checked=false;
  document.getElementById('add_psw').innerHTML="";
  document.getElementById('add_key').innerHTML="";
  
       if (tab00.rows[tab00.rows.length-1].idx==-1) s=tab00.rows.length-1;
  else if (tab00.rows[1].idx==-1) s=2;
  else s=1;
  add_bd(item,s);  
}
function add_bd(item,ir)
{
  var idx=0,key=theKey(item);
  while (idx<bd.length)
  {
   if (key==theKey(bd[idx]))
   {
    break;   
   }
   idx++;   
  }
  bd[idx]=item;
  add_item(item,key,ir);    
  localStorage.setItem(addr00+'bd',JSON.stringify(bd));
}
function bExtract(e,ii)
{  
 var key=theKey(bd00[ii]);
 if (edt00)
 {
  var item=bd00[ii];  
  if (e.checked) item.ex=undefined;
           else
  {
   r = prompt(bdXX[ii].key+' - для удаления из списка введите "d", иное - исключение из ротации', '');      
   if (typeof(r)=='string')
   {      
    if ((r=='d') || (r=='D'))
    {
     bDel(ii);
    }
   } else
   {
    e.checked=true;   
    return;   
   }
   item.ex=1;
  }
  localStorage.removeItem(addr00+'norot_'+key);  
  add_bd(item,-1); 
 } else
 {
  if (e.checked) 
  {
   bdXX[ii].rot=true;   
   bd00[ii].ex=undefined;
   localStorage.removeItem(addr00+'norot_'+key);
  } else
  {
   bdXX[ii].rot=false;
   bd00[ii].ex=1;
   localStorage.setItem(addr00+'norot_'+key,"1");
  }
 }
}
function add_item(item,key,ir)
{
  if (typeof(item.b)!='undefined') return;
      
  var s,itemXX, ii=0;
  while (ii<bd00.length)
  {
    if (key==bdXX[ii].key)
    {              
     itemXX=bdXX[ii];
     break;
    }
    ii++;
  }     
  item.t=Number(item.t+'');
  item.p=Number(item.p+'');    
  if (edt00)
  {
   localStorage.removeItem(addr00+'norot_'+key);   
  } else
  if (localStorage.getItem(addr00+'norot_'+key)!=undefined)
  {
   item.ex=1;   
  }
  if (typeof(item.i)=='number')
  {      
   if (item.i!=1) item.i=undefined;
  } else item.i=undefined;
  
  if (ii==bd00.length)
  {         
   itemXX ={};  
   itemXX.key=key;
   itemXX.tr=tab00.insertRow(ir);
   itemXX.tr.idx=ii;
   if (edt00)
   {
   itemXX.tr.ondblclick=function ()
   {      
      document.getElementById('new_l').value=bd00[ii].l;
      document.getElementById('new_v').value=bd00[ii].v;
      document.getElementById('new_p').value=bd00[ii].p;
      document.getElementById('new_t').value=bd00[ii].t;
      document.getElementById('new_i').checked=(!(typeof(bd00[ii].i)=='undefined'));
      if ((bd00[ii].v2!=undefined) || (bd00[ii].v3!=undefined))
      {
        add_psw(bd00[ii].v2,bd00[ii].v3);
      } else document.getElementById('add_psw').innerHTML="";
      if (typeof(bd00[ii].k)=='string')
      {
       add_key(bd00[ii].k);
      } else document.getElementById('add_key').innerHTML="";
   };
   }
   itemXX.td=document.createElement('td');  
   itemXX.td.ondblclick=function (event){
      bDbClk(ii);event.stopPropagation();
   };
   if (localStorage.getItem(addr00+'data_'+key)==undefined)
   {
    var dt = new Date();
    itemXX.d= new Date(dt.getTime()-(1000*60*item.t));
   } else
   {
    itemXX.d= new Date(localStorage.getItem(addr00+'data_'+key));
   }    
  }    
   s="<td>";
   //s+="<button onclick='bDel("+ii+");' title='Исключить'>X</button>";
   s+="<input type='checkbox' id='sel_p' onchange='bExtract(this,"+ii+");' title="
   if (typeof(item.ex)=='undefined')
   {      
    s+="'Учавствует в ротации' checked";
    itemXX.rot=true;
   } else 
   {
    s+="'Не учавствует в ротации'";   
    itemXX.rot=false;    
   }
   s+="/>";
   s+="<button onclick='bClk2("+ii+");' title='Открыть";
   if (!itemXX.rot)
   {
    s+=" в индивидуальном окне";   
   }
   s+="'>";
   if (typeof(item.i)=='number')
   {
    s+="<b>"+key+"</b>";
   } else
   {
    s+=key;
   }
   s+"</button></td>";   
   itemXX.tr.innerHTML=s;
   itemXX.tr.innerHTML+="<td>"+item.v+"</td>";
   itemXX.tr.innerHTML+="<td>"+item.p+"</td>";
   itemXX.tr.innerHTML+="<td>"+item.t+"</td>";   
   itemXX.td.innerHTML="";
   itemXX.tr.appendChild(itemXX.td);
   
   bdXX[ii]=itemXX;
   bd00[ii]=item;      
 
}
function chselp(e)
{ 
 sel00=e.checked;
 if (e.checked)
 {
  localStorage.setItem(addr00+'sel_p',"true");        
 } else
 {
  localStorage.removeItem(addr00+'sel_p');
 }
}
function chselp2(e)
{ 
 sel_auto00=e.checked;
 if (e.checked)
 {
  localStorage.setItem(addr00+'sel_auto',"true"); 
 } else
 {
  localStorage.removeItem(addr00+'sel_auto');
 }
}
function add_key(s)
{
 var sp=document.getElementById('add_key');    
 if (s==undefined) s='';   
 if ((s!='') || (sp.innerHTML==''))
 {
  var st="style='box-sizing: border-box;width: 100%;'";  
  sp.innerHTML="<input id='new_k' type='text' size='2' value='"+s+"' title='Ключ' "+st+"/>";
 } else
 {
  sp.innerHTML="";   
 }
}
function add_psw(s,w)
{
 var sp=document.getElementById('add_psw');
 if (s==undefined) s='';
 if (w==undefined) w='';
 if ((s!='') || (w!='') || (sp.innerHTML==''))
 {
  var st="style='box-sizing: border-box;width: 100%;'";  
  sp.innerHTML="<input id='new_v2' type='text' size='2' value='"+s+"' title='Дополнительно-1' "+st+"/><br/><input id='new_v3' type='text' size='2' value='"+w+"' title='Дополнительно-2' "+st+"/>";
 } else
 {
  sp.innerHTML="";   
 }
}
function add_endtb(tab)
{
if (!edt00) return;
var tr=tab.insertRow(-1);
tr.idx=-1;
var st="style='box-sizing: border-box;width: 100%;'"
//document.createElement('tr'); 
s="<td><input id='new_l' type='text' size='5' value='' title='Адрес' ondblclick='add_key();' "+st+"/><spin id='add_key'></spin></td>";
//s+="<td><button onclick='add_psw();' title='Добавить поле' style='width:25px'>+</button><input id='new_v' type='text' size='20' value='' title='Описание' /><spin id='add_psw'></spin></td
s+="<td><input id='new_v' type='text' size='5' value='' title='Описание' ondblclick='add_psw();' "+st+"/><spin id='add_psw'></spin></td>"; //v
s+="<td><input id='new_p' type='text' size='5' value='' title='Вес' "+st+"/></td>";//p
s+="<td><input id='new_t' type='text' size='5' value='' title='Интервал,мин' "+st+"/></td>"; //t
s+="<td><input type='checkbox' id='new_i' title='Открывать в отдельном окне' value='1'/><button onclick='bAdd();' title='Добавить'>Добавить</button></td>";
/*
s+="<td><button onclick='bAdd();' title='Добавить'>Добавить</button><input type='checkbox' id='sel_p' onchange='chselp(this);' title='Выбирать с наибольшим весом' ";
if (localStorage.getItem(addr00+'sel_p')!=undefined)
{
 s+="checked";sel00=true;
}
s+="/></td>";
*/
tr.innerHTML=s;
//<input type='checkbox' id='sel_p' title='Выбирать с наибольшим весом'/>
//tab00.appendChild(tr);     
}
function chkOpn()
{
  if (wop00!==undefined) 
  {
    if (!(wop00.closed))
    {  
     tmReset(wop00.i);
    }
  }
  if (wop01!==undefined) 
  {
    if (!(wop01.closed))
    {
     tmReset(wop01_i);  
    }
  }   
  if (run00) 
  {
   if (sel_auto00)
   {
     if (wop01_i>=0)   
     {
      if (wop01!==undefined) 
      {
       if (wop01.closed)
       {
        funNextKran();
       }
      }      
     } else chkRunStop();
   } else chkRunStop();  
  }
}
function tablecomplete(nm)
{
bd00=[];
bdXX=[];
tab00 = document.getElementById(nm); 
setInterval(chkOpn,500);
setInterval(chkLnk,5000);
var key;
bd.forEach(function(item, i, arr) 
{  
  key=theKey(item);
  add_item(item,key,-1);
});
add_endtb(tab00);
chkLnk();
}
function saveelm(nm,vl)
{
 if ((vl!=undefined) && (vl!=""))
 {  
  localStorage.setItem(nm,vl);
 } else
 {
  localStorage.removeItem(nm);
 } 
}
function addrcreate(nm)
{
  if (nm=='')   
  {
   if (typeof(param.type)=='string') nm=param.type;
  }     
  var d = document.getElementById(nm+'_addr');
  if (d==undefined) d = document.getElementById('kran_addr');
  if (d!==undefined)
  {
   var s='<input type="text" size="40" value="';
   if (localStorage.getItem(nm)!=undefined)
   {
     s+=localStorage.getItem(nm); 
   }   
   s+='" onchange="saveelm(\''+nm+'\',value);">'; 
   d.innerHTML+=s;
  }
  //document.write(s);
}
function bRunStop()
{ 
 if (run00)
 {
   if (wop00!==undefined) 
    {
     if (!(wop00.closed))
     {  
      wop00.close();
     }
    }
    if (wop01!==undefined) 
    {
      if (!(wop01.closed))
      {       
       wop01.close();wop01_i=-1;
      } 
    }     
 } else
 {
  funRun();
 }
}
function createcontrol(nm)
{ 
 if ((nm=='') && (typeof(param.type)=='string')) nm=param.type;
 var d = document.getElementById(nm+'_ctrl');
 if (d==undefined) d = document.getElementById('kran_ctrl');
 var s="<button id='btn_run' onclick='bRunStop();' title=''></button><input type='checkbox' id='sel_p' onchange='chselp(this);' title='Выбирать сайт с наибольшим весом' ";
 if (localStorage.getItem(nm+'sel_p')!=undefined)
 {
  s+="checked";sel00=true;
 }
 s+="/>";
 s+="<input type='checkbox' id='sel_auto' onchange='chselp2(this);' title='При закрытии текущего автоматически открывать следующий сайт (Нужно разрешение браузера)' ";
 if (localStorage.getItem(nm+'sel_auto')!=undefined)
 {
  s+="checked";sel_auto00=true;
 }
 s+="/>";
 s+="<button id='btn_nxt' onclick='funNextKran();' title='Следующий сайт'>Далее</button>"; 
 s+="<br/><iframe src='"+scrPath+"recl.html' width='90%' height='20px' frameborder=no></iframe>";
 d.innerHTML+=s;         
 chkRunStop(); 
}
function tablecreate(nm)
{ 
 if (nm=='')   
 {
  if (typeof(param.type)=='string') nm=param.type;
 } 
 addr00=nm;
 var d = document.getElementById(nm+'_table');
 if (d==undefined) d = document.getElementById('kran_table');
 if (d!==undefined)
 {    
   var s='<table id="'+nm+'" class="sortable"><thead><tr><td>Сайт</td><td>Описание</td>';
           s+='<td>Вес</td><td>Интервал,мин</td><td>Прошло,мин</td></tr></thead><tbody></tbody></table>';    
   d.innerHTML+=s;         
 loadScripts(scrPath+nm+'.js', function( status )
 {  
  if ( status ) 
  {   
    bd_const=eval(nm);
  } else
  { 
    bd_const=eval(nm);
    if (bd_const==undefined) bd_const=[];    // alert(nm+" БД! Не найдена!" );  
  }
   var bdv=localStorage.getItem(addr00+'bd');
   if (bdv!=undefined)
   {
    bd=JSON.parse(bdv);
    if ( status ) 
    {
        bd_const.forEach(function(item, i, arr) 
        {  
         key=theKey(item);
         var i=0;
         while (i<bd.length)
         {
           if (key==theKey(bd[i])) 
           {
             bd[i].l=item.l;
             break;
           }
           i++;  
         }
         if (i==bd.length)
         { // Не нашли - добавить
          bd.unshift(item);
         }
        });
    }
   } else
   {
    bd=bd_const;
   }
   tablecomplete(nm);
   
});
  }  
  
}
function outrotator(nm,ed)
{
  if (ed!==undefined) edt00=true;
  document.write('<div id="kran_addr">Ваш кошелек:</div><div id="kran_ctrl"></div><div id="kran_table"></div>');  
  addrcreate(nm);
  createcontrol(nm);
  tablecreate(nm);  
}
window.onunload=function()
{
 if (wop00!==undefined) 
 {
    if (!(wop00.closed))
    {  
      wop00.topclosed();
    }
 }       
}