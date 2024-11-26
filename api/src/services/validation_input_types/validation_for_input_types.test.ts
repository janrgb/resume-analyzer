import fs from 'fs'
import path from 'path'
import { addFile } from './validation_for_input_types'
import { addDesc } from './validation_for_input_types'
import mime from 'mime-types'

const wrongExtFile = path.join(__dirname, 'guh.png')
const tooLargeFile = path.join(__dirname, 'bosch.pdf')


describe("Validation For Input Types Test", () => {
  it("should only accept PDF files", async () => {

    const file = new File([fs.readFileSync(wrongExtFile)], 'guh.png', { type:
    mime.lookup(wrongExtFile).toString() })

    const result = await addFile({
      input: file
    })

    expect(result.status).toBe("error")
    expect(result.message).toBe("Invalid File Type!")
  })

  it("should accept files under or equal to 2 MB", async () => {

    const file = new File([fs.readFileSync(tooLargeFile)], 'bosch.pdf', { type:
    mime.lookup(tooLargeFile).toString() })

    const result = await addFile({
      input: file
    })

    expect(result.status).toBe("error")
    expect(result.message).toBe("File Size Limit Exceeded!")
  })

  it("Job Descriptions over 5000 Characters should trigger an error", async () => {

    const jobDesc = "1ajQzy-DC%V%#MPdHfm9v6;St{u7t}0(7_V?(n6qwUh_{9)m:Lf;v.aXfki}J46v4V23*]kp$]Bu_[GM5*d)Jvx4wn8?]ght]U84bvqdjqg}GxA3[9f6Z_8pUvHCv;gBTK;x8jnh[X_MR2:q9dDgF-B?EEc]9}#QPFVg0EpY6RDp5w7@rBgqQFh2Jfh=8n)t#3cc0-SkGy$=[G)SmWG2(Vb,(fEtyAQHz.rjDJ8;:0r(Cuqr19K2&?/0*2=c;XXQmp{4rYL&Vq%h{0vFm$&d0S$B_11+$$,xRZ7R%,GDgA}kT$A.!z@SVVLJGD7UmBZn2LXbQdhCAC2{KzWLcut{cp}[YE$W1;g4Ra(.(mhR8K;6!H!V:nk5]9G[UD8:qWtLwV_zbxH#/=/]})WP[q;F:Fm/?]pYeE5ngf1&68Ar7UZ6ey*b?-hp26auhQC0@?f_P$*BFf%W7&dY;k:i9a(B}=%5A1U2Y.hn%#eCC0!8#DL}TN[Dhn&vC&@Lk=y$NMBYju/R)HWk1Zh(q)_]AY?E1v_QeW,UBm!Rq&f2MWgKUB.H4ywx:LSB&$2@yS4#Q1FYeED0CKSj%dW)ZA3HAV3w0kbWG{47i#RzHx,TeZ3H;_Yq@H,*t*]XWN)NSPyr6/)MCm4d?LYwSLP/;tV}3LJ:(ucf=V7y+N@H2-#?ba_VY:!Ub3;AVp&dxvc:n_WnL@/crkhS)#yYp%2v)0_&,_,vFSBe+pTCTNNw2r.G73rKYyy5YD%H!g@Y33TxB}Arzq-f8jW?#EQK@Y(cTJ4P)+vJDQFp5/:e)9zjn#d$7m6(p+Qw0kv}z3E5r:7z2)y*P*&)xhSxSU!jCxK6%kzG_0A3NwkCaC=*GT;pCk-S14cc%N*)*?rxj$,i*=WMa.$]q*/aB8_8K6R@XihnqYK_{*[xCpuNCvM-HfkY/]B,qUhyfYHE%)$/g[myyL/f&}X6;eaYnxaZ9}(a/(TLW!gy!p,K[[ARB%)TcxHZ!)E()g&nGKg}g[B%ca:B@Pp}r+kqJ9Y7?ryv@V9Vwu9g8VD}W,n;[C-pY3gU)uRJ.V9%:p{8dU*W8mRDrWzB+7x?[i3V5+jZ*4NY:d*3p2}5}P1:KQ9?L(:iU{31(50nLnW*8B}p]u0AR_,DjmHF)M$hS[r}u,t;dj?gfp[R.kt}_djTH:pxWbC}iQ%/4=pYCF9r#h6E0z=aXL6Hmwvn]YfeJP=]1LN1%%NjJ2[.dF}UZ93u]7YtS0wu.bDp{RR9UK#mBt+B6FG&X,Pj@vfN)!10:.ua5Mi9c{]Y]e0X7CzgLT%Z(1,X;3N=8-&v:$.$;iKn)N7MUx;fHaWwnN.NN.i&G4c}E@BPqrdANXv.RE}t},*-%Lz.)PmP+}Cc!?$fhe]:Re[N/(_Pw{H;9T$:QZ;V]@pGG2W}J#QX8]#8:xmqMk)pudq_4e(ww$KDZ![P=x:#jX*}JY*/J6YPzndeGJya7)Q!8;@.k=JGU%RGL%#-C%a:/(m7t:SZ7F1(GrdNyaSZ3q7cF4D#_B*..#vER{;5+tny?8Wu%iG]Fw.VrBLh2YTZe-nWMRd7)0w-$!WZ]_R2qCV3m7YmM@?LHHGZ-{Uh)Aq9R7dxxyTNDvB#5_0!My:,gt$DvnFN+3-(ed&aJPnQ}}U6P!EcSV;x_AQz/%je1A,=gYJU?GV$X?,$]Y@[f$M.=3@0@jJGR$N-:3qHH)WS?Z,0HAnQY6t{g))N:iEK}tXQj.DzS{F59HA1-n?:#{bDW]QXv@figaX@{n3Sx3V23H4.bv}%XyYXSPVqn{ge=0ynXcMVic1*.vYQr3tnx#F1N5g8h_%[H%gx*a]D!fYG,xU1]F&J_)*kw}iM2eJkjyX83L1XHUu}R:iB2}Y!9-H!&uF$_Eni:zAxp}9$f97:w)7i2L#zg95CS-2.hiyCf*S)m8E4q_Ef;cYnp)2Yvb1YK2h]emtp8.Sjq!&9D,qQ?y&!8{7ZKf0_$8bWqP@@Wd!Y]CVvJR@wPNDTa:vK6jryV6!5:nEy.i]@NNnYPckb&6X6HX+?i&i6QcMWDj-hUPQR?UAV9n)QW*$Ut]8MFYzj1cXa4,Y9_DADLhe30+d!:LUg?1hdvb.E4fiZh&C(,@V@yHd1mqQy.Tq.k53cwg8r!;ZCUK%Fi9MUDK{Kx50nTPz$!ZFL/E:8,K[fV-5%XR_M-+B-vDQud+=9c7GmJ??+Fe-p8#+1[pq08-3w}v.f}wC7[!qZjv@bNa&pk*Vv%Np1:Zn)vbg_B@tM&x#xfC*-wzjak.V3%X5Q}YqT@6L92HP=P5wUM?A,+SP;]vqc!UkT:64M;ZcHgtL4!CXU{&&DCnBUNx{ZGxwNihx40+@Kcxt(6Zv9fr6vQ?g%;_AHvy.Fgf=g;-Eug,,ye[*dny?mM-z(X=_?H]r,j&Jj+epAFMq=Y_m;i9#YJd0[bc!Vd3dy)]hNu2U6ZmNPBM%quknaz4[0a18TJ!=t+QKQqL0NP[,/x&KK8R9jFM&ei8G7E_@K6d&*]j]EJcU[-i=vH#Z7n6NMWjz5}:D0VaN5i4em?,_Z,F@:iW#LhhKg#n5x@8+ceBBB[56pAcNVNbuj*fArXefBqKiBSTcS0Jq]M/zuGQAY0g_NYnc&(.0;C[%n%YDnx+krJ(ASZU_HkS;i2X)cT3r5GLdH2;NaA6M{2[#M_8(e9(=#M2(?2j}D.ibhY3A)vmcf==m:dtEM9*t;Qi&Ym=!dKEwyL:aG6f&F}/B8rRH&mvHJDXG?!39,?Ca3Y8QV]*EVYPT]P_BVN(K&WiZW9xYnLk1G]gex$;eE*dyAw3-}3Gj(GffqZS8e#e{-n(ia-6F!j;-8ywz&t=_5i;]D4XvUN5Ax-BPESX*W%f+2HjDdP5eA5hPnb?:QjDjH*K,PB=UAzpCw}+XD_{MgC5*.-pTM_7arpcu,q07(.W]Z#$#38@+K{5@8hy0q68QKJ}[xBiNYC$HBE?rAx[J44J?fGmQ${*aQ+afE{L)qgJ(__-dU,%n29=nW:rtYZK/t1.geHW:,ueASxt?K+ch+n-LX}98ZwS=G/%)wzh+;c%17wE}:@HU9HBw6ZjTP+;kh!)=kL$8*fM[DS!du$1+]Y7W4P1avw@QZa.2H,Yn,25{3YW7B/fu4wkybHA7!$kaB2Hcq{cXw3)DT@y4/M:9q91P97+9ErK6XFt:*DRz&J):Z6RTDJN+$R?7_6N!ASmd_zG?/n#mJUhH2$t&/xGu-/aW*fB,#H#i4ur]j5],)&--u@C{,8e-*-A6p;KjYx&M2Y0W-h7Wp04iLh-$&8naJ3?+xzHDk[]7bXp$k/NK{nK(d((Pn6t5yeaR&DQwp3?qf9NV=+nk,tUva)-TYB%n6{P?kAD4JUn3)ZpSR6u#2*?RAA7prU1HALWfCK-ShP3:]W8bedXSFem$,;e2Tv%_%&egPttcSW{)M2EhfX8XRefPMiBd.8Puw0T}}1J]L/,dLKL.fy54Wji}Y-]_PM&2#0z[P1h}(2TWY/)Bf-Y*N2p1mLX[V+1wTDbfjD6V}_?,REv0eC[.yAJ+gA=#VF9$!&e8jnQMTz)!hQ=zwDb,cu!+ZFi+nLYi#c:?$R5fibivE[C*p&3XR-qx&yqz8TTT)k0X1VntFJH?n,$Q){PrHNfj24j44]%pa.uZ)a5JT$KY(,q2tN{fz5-N&thbiW]n}iG%GfuK,LLE;-}e2m;dGK*S8ttP1h.c@7deQ8?@c@;.{y9Y#@ZQTv(2wc[bXy)-_TV[LFhtj%[?9a*Qtv?GhhB=XS8LAt.XQFAZd[9[T);P(t_V?9m7:Az,,)RFF9EKBQ9(Y&R%_8yuJF/UG(W+zwSdziY;S6amLbLqxuKDcQk+?5Nxx),Q+=XhfkLvU}e4(&8Y.(9UTJQ7T6E880bQ7B&QipXPx%$3T(yJna+:S3MD4WF(.ikm16A5zL31?)jSMP-P+)?qm#[Hx$i?PuEZB_iv[m2M:)kimd9@;)m]ELNVbA3rc4x-RA$}t,FYh1/m?[wx5ykt7Kr!%@r]%=/1u0jz2yeYdjb&jFraj7S!YTx#.+_}%Yb31n3gYAUmxciW%f]MWvN:KTc8Q#[gdjRe8kDz;vG%N7ZcVdu_VqdTf%{SXD]2vWaYZLuEnaY8y5p*[;Jf(d05BSi%j]!.]rV,mpF_VVR#(zU].2g37)!F*N_td_Zi;tm{[keHDx]gvMyuiE6pr5C(TmQP+GLbq?}F)BQ[X:U)m3@rCcguxNgb-[!@+k:*2!2i:3Xv(u3Tuwdg3+X*F*#M}9+Xd%SQeiY*R[#AY4zGEVk+M1Z1P16+-R,9LMFPLni)L7ipV9pG!QPq$-v8f0F7H.B4]VzcnM!/FXm[U-k*Cz=5T-!;T:u?eCvw8f;A,]1F6$P3VPg$F{YmB+8&}pRi=z.&9AQJLNPB%)SA2t-bZ}rfzHQa87[;-j}Eb3hC#a=0,a/*{NH[hjU=}m2=}JDw5WKF0FF{9WqYD-&F$,/f8Dkzx+%#ut+x[!,B#(#@@J=GQ8}A;3#ATYj=q@EBL-{qT9PeP/aa!Uy+:8YaP23dYmEe[8#:&=5)Lp&wtjdT(rqn1d2.p#8zS2BL&HL-uT&G8v:avnjJ]W:@x#4[nEBc3LAdt&50mDWDGjbbQL#NUd4H{Nt1&tY3G$9C3hf{20$8k_@MP_6v1j1kcgp2k0AZByfQ_T[hy}!Ku67,u5f06W.;/Pgk@xx{[(!tT0H(VH!vPJ8hD@RC:UX9qTz:U6rZDq]n;dS2;C1q2Di5QBY},()!=g[_C_rHQcS87wDi+KXwX4uF:08+&]}%0&/UX]Z7![hC?(PcVprpbqZZgV]NK8q$C7mm[Dg(#0up/Kqia),ApM3]A#TjHnhj+uk8!HMWNB(w[G;5FSa9z32VpW=$T{$Nr@,uR3_Hp8Kxuy;tm4aS]bwY.]#7$*m_neKqELQX$q74bc-Dw3(2(x95m1*aAb/yV-x@JR{2;GgTw({L&yyAS?8ceH(GmZ6UW]:w)AM5R7Z@tkn68$WbWNSxtgPfJb7-HW2iP7A3kz"

    const descResult = await addDesc({
      input:{content: jobDesc}
    })

    expect(descResult.status).toBe("error")
    expect(descResult.message).toBe("Character Limit Exceeded!")
  })



})