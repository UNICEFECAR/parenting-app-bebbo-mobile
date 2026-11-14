/** Parse bounded image headers before passing imported bytes to native decoders. */
export function validateBackupPhoto(data: string): void {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const out: number[] = [];
  for (let i=0;i<Math.min(data.length,87384);i+=4) {
    const a=alphabet.indexOf(data[i]), b=alphabet.indexOf(data[i+1]), c=alphabet.indexOf(data[i+2]), d=alphabet.indexOf(data[i+3]);
    out.push((a<<2)|(b>>4)); if(c>=0)out.push(((b&15)<<4)|(c>>2));if(d>=0)out.push(((c&3)<<6)|d);
  }
  const u16=(i:number)=>(out[i]<<8)|out[i+1];
  let width=0,height=0;
  if ([137,80,78,71,13,10,26,10].every((b,i)=>out[i]===b) && out.length>=24 && out.slice(12,16).join(',')==='73,72,68,82') {
    const u32=(i:number)=>out[i]*16777216+out[i+1]*65536+out[i+2]*256+out[i+3]; width=u32(16);height=u32(20);
  } else if(out[0]===255 && out[1]===216) {
    let pos=2;
    while(pos+8<out.length) {
      if(out[pos++]!==255)break;
      while(out[pos]===255)pos++;
      const marker=out[pos++], length=u16(pos);
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) {height=u16(pos+3);width=u16(pos+5);break;}
      if(length<2)break; pos+=length;
    }
  }
  if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1||width>4096||height>4096||width*height>16000000) throw new Error('Profile photos must be JPEG or PNG images up to 4096 pixels');
}
