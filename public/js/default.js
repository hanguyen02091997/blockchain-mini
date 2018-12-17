$(function(){$("[rel='tooltip']").tooltip({html:true});});var blnIsFirstTime=true;var intCounterColor=0;var maxloop=200;var ws;var socketurl;var lastprice;if(location.protocol==='https:'){socketurl="wss://"+window.location.hostname+"/wshandler";}else{socketurl="ws://"+window.location.hostname+"/wshandler";}
$().ready(function(){function connectsocket(stype){var intcounter=0;if(blnIsFirstTime==false){$('#labelswitch').attr('data-original-title','Processing, please wait..');$('#labelswitch').mouseover();}
ws=new WebSocket(socketurl);ws.onopen=function(){console.log("->Connected..");var ping=pinger(ws);if(ws.readyState==WebSocket.OPEN){ws.send('{"event": "'+stype+'"}');$('#labelswitch').attr('data-original-title','+Realtime Updates Enabled, Toggle to Disable');if(blnIsFirstTime==false){$('#labelswitch').mouseover();}else{blnIsFirstTime=false;}}
else{console.log("->Connection is closed");toggleSwitchDisplay(false);}};ws.onmessage=function(evt){if(evt.data!==''){var obj=jQuery.parseJSON(evt.data);if(obj.dashb!==undefined){if(lastprice!==obj.dashb.price){$('#price').fadeOut(0,function(){$(this).text(obj.dashb.price).fadeIn(1000);});var decPercentage;if(obj.dashb.decOpenPrice<obj.dashb.decCurrentPrice){decPercentage="<font color='#0ADC00' size='2'> <i class='fa fa-caret-up' style='font-size: 1em; margin-top:8px; margin-right:3px; color:#0ADC00'></i><b>"+(((obj.dashb.decCurrentPrice-obj.dashb.decOpenPrice)/obj.dashb.decOpenPrice)*100).toFixed(2)+"%</b></font>";}else if(obj.dashb.decOpenPrice>obj.dashb.decCurrentPrice){decPercentage="<font color='brown' size='2'> <i class='fa fa-caret-down' style='font-size: 1em; margin-top:8px; margin-right:3px; color:brown'></i>"+(Math.abs((obj.dashb.decCurrentPrice-obj.dashb.decOpenPrice)/obj.dashb.decOpenPrice)*100).toFixed(2)+"%</font>";}
$('#price_percent').fadeOut(0,function(){$(this).html(decPercentage).fadeIn(400);});}
lastprice=obj.dashb.price;$('#lastblock').fadeOut(0,function(){$(this).text(obj.dashb.lastblock).fadeIn(1000);});intcounter=intcounter+1;if(intcounter>maxloop){console.log("maxloop = "+maxloop+", closing connnection");ws.close();}else{$('#facube').addClass("fa-spin");$('#faalt').addClass("fa-spin");for(var i in obj.blocks){$('#mCSB_1_container').children().last().remove();$(insertblock(obj.blocks[i].b_no,obj.blocks[i].b_time,obj.blocks[i].b_miner_tag,obj.blocks[i].b_miner,obj.blocks[i].b_txns,obj.blocks[i].b_mtime,obj.blocks[i].b_reward)).hide().prependTo("#mCSB_1_container").fadeIn(1250);startstopwatch(obj.blocks[i].b_time,"cd"+obj.blocks[i].b_no)}
var strColor;intCounterColor=intCounterColor+1;if(intCounterColor==1){strColor="color-three";}else if(intCounterColor==2){strColor="color-six";}else if(intCounterColor==3){strColor="color-five";}else if(intCounterColor==4){strColor="color-four";}else{strColor="color-seven";intCounterColor=0}
for(var i in obj.txns){$('#mCSB_2_container').children().last().remove();$(inserttransaction(obj.txns[i].t_hash,obj.txns[i].t_from,obj.txns[i].t_to,obj.txns[i].t_contractAddress,obj.txns[i].t_amt,obj.txns[i].t_time,strColor)).prependTo("#mCSB_2_container");startstopwatch(obj.txns[i].t_time,"cd"+obj.txns[i].t_hash)}
setTimeout(function(){$('#facube').removeClass("fa-spin");$('#faalt').removeClass("fa-spin");},1500);}}}};ws.onerror=function(evt){console.log("->socket error");stopTimerAll();toggleSwitchDisplay(false);};ws.onclose=function(){var d=new Date();console.log("->disconnected..");stopTimerAll();toggleSwitchDisplay(false);};}
connectsocket("gs");startTimerAll();$('#togglesocket').change(function(){if($(this).is(":checked")){connectsocket("gsnew");}else{ws.close();}});function insertblock(height,age,strTagName,miner,noOfTransactions,strBlockTime,blockReward){var output;output="<div class='profile-event'>";output+="<div class='date-formats' style='width: 135px; height: 65px; margin-top:2px'>";output+="<span><a href='/block/"+height+"'><font size='2' color='white'>"+lang_block+" "+height+"</font></a></span>";output+="<small><div id='cd"+height+"' data-countdown='"+age+"'></div></small>";output+="</div>";output+="<div class='overflow-h'>";if(strTagName!=''){output+=lang_mined_by+" <a href='/address/"+miner+"' class='address-tag'>"+strTagName+"</a></p>";}else{output+=lang_mined_by+" <a href='/address/"+miner+"' class='address-tag'>"+miner+"</a></p>";};if(strTagName!=""){output+="<p><a href='/txs?block="+height+" title='Transactions in this Block'><b>"+noOfTransactions+" "+lang_txns+"</b></a> "+lang_in_X+" "+strBlockTime+" "+lang_sec+"</p>";}else{output+="<p><a href='/txs?block="+height+" title='Transactions in this Block'><b>"+noOfTransactions+" "+lang_txns+"</b></a> "+lang_in_X+" "+strBlockTime+" "+lang_secs+"</p>";}
output+="<p> "+lang_block_reward+" "+blockReward.replace("Ether",lang_ether)+"</p>";output+="</div>";output+="</div>";return output.toString()}
function inserttransaction(txhash,strFrom,strTo,strcontractAddress,value,age,strColor){var output;output="<div class='profile-post "+strColor+"'>";output+="<span class='profile-post-numb'><i class='fa fa-hdd-o'></i></span>";output+="<div class='profile-post-in'>";output+="<h3 class='heading-xs'>"+lang_tx+"# <a href='/tx/"+txhash+"' class='hash-tag-frontpage' title='Transaction Hash'><font color='#3498db'>"+txhash+"</font></a><span class='pull-right' style='font-size: small'>"
output+="<span id='cd"+txhash+"' data-countdown='"+age+"'></span> &nbsp;</span></h3>";output+="<p>"+lang_from+" <a href='/address/"+strFrom+"' class='address-tag'>"+strFrom+"</a> "+lang_to+" ";if(strcontractAddress==""){output+="<a href='/address/"+strTo+"' class='address-tag'>"+strTo+"</a>";}else{output+="[<a href='/address/"+strcontractAddress+"'>NewContract</a>]";}
output+="</p>";output+="<p>"+lang_amount+" "+value.replace("Ether",lang_ether)+"</p>";output+="</div>";output+="</div>";return output.toString()}
function stopTimerAll(){$('[data-countdown]').each(function(){var $this=$(this);$this.countdown('stop');});}
function startTimerAll(){$('[data-countdown]').each(function(){var $this=$(this),finalDate=new Date().getTime()-$(this).data('countdown');$this.countdown(finalDate,{elapse:true}).on('update.countdown',function(event){var hours=event.offset.hours;var minutes=event.offset.minutes;if(hours>0){$this.html(event.strftime('>%-H hr%!H %-M '+lang_min+'%!M %-S '+lang_secs));}else if(minutes>0){$this.html(event.strftime('>%-M '+lang_min+'%!M %-S '+lang_secs+' '+lang_ago));{}}else{$this.html(event.strftime('>%-S '+lang_secs+' '+lang_ago));}});});}
function startstopwatch(intmslapsed,elementname){var fiveSeconds=new Date().getTime()-intmslapsed;$("#"+elementname).countdown(fiveSeconds,{elapse:true}).on('update.countdown',function(event){var $this=$(this);var hours=event.offset.hours;var minutes=event.offset.minutes;if(hours>0){$this.html(event.strftime('>%-H hr%!H %-M '+ +lang_min+'%!M %-S '+lang_secs));}else if(minutes>0){$this.html(event.strftime('>%-M '+lang_min+'%!M %-S '+lang_secs+' '+lang_ago));{}}else{$this.html(event.strftime('>%-S '+lang_secs+' '+lang_ago));}});}
function toggleSwitchDisplay(blnStatus){if(blnStatus==false){$("#togglesocket").prop("checked",false);$('#labelswitch').attr('data-original-title','Realtime Updates Disabled, Click to Enable');}else{$("#togglesocket").prop("checked",true);$('#labelswitch').attr('data-original-title','+Realtime Updates Enabled, Click to Disable');}
$('#labelswitch').mouseover();}});function pinger(ws){var timer=setInterval(function(){if(ws.readyState==1){ws.send(JSON.stringify({event:"ping"}));console.log(JSON.stringify({event:"ping"}));}},60000);return{stop:function(){clearInterval(timer);}};}