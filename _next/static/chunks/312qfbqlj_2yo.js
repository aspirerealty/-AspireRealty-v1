(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,252,e=>{"use strict";let t,r,n;var i=e.i(43476),s=e.i(71645),a=e.i(75056),o=e.i(98903),l=e.i(38408),c=e.i(39355),d=e.i(31067),u=e.i(90072),f=u,h=u;let p=new h.VQ,m=new h.cE;class x extends h.Kx{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new h.ki([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new h.ki([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new h.hC(t,6,1);return this.setAttribute("instanceStart",new h.Zq(r,3,0)),this.setAttribute("instanceEnd",new h.Zq(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let n=new h.hC(r,2*t,1);return this.setAttribute("instanceColorStart",new h.Zq(n,t,0)),this.setAttribute("instanceColorEnd",new h.Zq(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new h.nw(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new h.VQ);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),p.setFromBufferAttribute(t),this.boundingBox.union(p))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new h.L0),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let n=0;for(let i=0,s=e.count;i<s;i++)m.fromBufferAttribute(e,i),n=Math.max(n,r.distanceToSquared(m)),m.fromBufferAttribute(t,i),n=Math.max(n,r.distanceToSquared(m));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var g=u,y=e.i(8560),v=e.i(31497);class w extends g.Zg{constructor(e){super({type:"LineMaterial",uniforms:g.SP.clone(g.SP.merge([y.O.common,y.O.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new g.wq(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${v.f>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let S=v.f>=125?"uv1":"uv2",b=new f.$i,M=new f.cE,j=new f.cE,E=new f.$i,A=new f.$i,R=new f.$i,_=new f.cE,L=new f.nd,z=new f._i,U=new f.cE,C=new f.VQ,B=new f.L0,O=new f.$i;function P(e,t,n){return O.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),O.multiplyScalar(1/O.w),O.x=r/n.width,O.y=r/n.height,O.applyMatrix4(e.projectionMatrixInverse),O.multiplyScalar(1/O.w),Math.abs(Math.max(O.x,O.y))}class G extends f.kE{constructor(e=new x,t=new w({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,i=0,s=t.count;e<s;e++,i+=2)M.fromBufferAttribute(t,e),j.fromBufferAttribute(r,e),n[i]=0===i?0:n[i-1],n[i+1]=n[i]+M.distanceTo(j);let i=new f.hC(n,2,1);return e.setAttribute("instanceDistanceStart",new f.Zq(i,1,0)),e.setAttribute("instanceDistanceEnd",new f.Zq(i,1,1)),this}raycast(e,n){let i,s,a=this.material.worldUnits,o=e.camera;null!==o||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,d=this.geometry,u=this.material;if(r=u.linewidth+l,null===d.boundingSphere&&d.computeBoundingSphere(),B.copy(d.boundingSphere).applyMatrix4(c),a)i=.5*r;else{let e=Math.max(o.near,B.distanceToPoint(t.origin));i=P(o,e,u.resolution)}if(B.radius+=i,!1!==t.intersectsSphere(B)){if(null===d.boundingBox&&d.computeBoundingBox(),C.copy(d.boundingBox).applyMatrix4(c),a)s=.5*r;else{let e=Math.max(o.near,C.distanceToPoint(t.origin));s=P(o,e,u.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,n){let i=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,o=s.attributes.instanceEnd,l=Math.min(s.instanceCount,a.count);for(let s=0;s<l;s++){z.start.fromBufferAttribute(a,s),z.end.fromBufferAttribute(o,s),z.applyMatrix4(i);let l=new f.cE,c=new f.cE;t.distanceSqToSegment(z.start,z.end,c,l),c.distanceTo(l)<.5*r&&n.push({point:c,pointOnLine:l,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[S]:null})}}(this,n):function(e,n,i){let s=n.projectionMatrix,a=e.material.resolution,o=e.matrixWorld,l=e.geometry,c=l.attributes.instanceStart,d=l.attributes.instanceEnd,u=Math.min(l.instanceCount,c.count),h=-n.near;t.at(1,R),R.w=1,R.applyMatrix4(n.matrixWorldInverse),R.applyMatrix4(s),R.multiplyScalar(1/R.w),R.x*=a.x/2,R.y*=a.y/2,R.z=0,_.copy(R),L.multiplyMatrices(n.matrixWorldInverse,o);for(let n=0;n<u;n++){if(E.fromBufferAttribute(c,n),A.fromBufferAttribute(d,n),E.w=1,A.w=1,E.applyMatrix4(L),A.applyMatrix4(L),E.z>h&&A.z>h)continue;if(E.z>h){let e=E.z-A.z,t=(E.z-h)/e;E.lerp(A,t)}else if(A.z>h){let e=A.z-E.z,t=(A.z-h)/e;A.lerp(E,t)}E.applyMatrix4(s),A.applyMatrix4(s),E.multiplyScalar(1/E.w),A.multiplyScalar(1/A.w),E.x*=a.x/2,E.y*=a.y/2,A.x*=a.x/2,A.y*=a.y/2,z.start.copy(E),z.start.z=0,z.end.copy(A),z.end.z=0;let l=z.closestPointToPointParameter(_,!0);z.at(l,U);let u=f.rB.lerp(E.z,A.z,l),p=u>=-1&&u<=1,m=_.distanceTo(U)<.5*r;if(p&&m){z.start.fromBufferAttribute(c,n),z.end.fromBufferAttribute(d,n),z.start.applyMatrix4(o),z.end.applyMatrix4(o);let r=new f.cE,s=new f.cE;t.distanceSqToSegment(z.start,z.end,s,r),i.push({point:s,pointOnLine:r,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[S]:null})}}}(this,o,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(b),this.material.uniforms.resolution.value.set(b.z,b.w))}}class D extends x{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let n=0;n<t;n+=3)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,n=new Float32Array(2*r);if(3===t)for(let i=0;i<r;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<r;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class T extends G{constructor(e=new D,t=new w({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let k=s.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:n,lineWidth:i,segments:a,dashed:o,...c},f){var h,p;let m=(0,l.f)(e=>e.size),g=s.useMemo(()=>a?new G:new T,[a]),[y]=s.useState(()=>new w),v=(null==r||null==(h=r[0])?void 0:h.length)===4?4:3,S=s.useMemo(()=>{let n=a?new x:new D,i=e.map(e=>{let t=Array.isArray(e);return e instanceof u.cE||e instanceof u.$i?[e.x,e.y,e.z]:e instanceof u.wq?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(i.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof u.Es?e.toArray():e);n.setColors(e.flat(),v)}return n},[e,a,r,v]);return s.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),s.useLayoutEffect(()=>{o?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[o,y]),s.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),s.createElement("primitive",(0,d.f)({object:g,ref:f},c),s.createElement("primitive",{object:S,attach:"geometry"}),s.createElement("primitive",(0,d.f)({object:y,attach:"material",color:t,vertexColors:!!r,resolution:[m.width,m.height],linewidth:null!=(p=null!=n?n:i)?p:1,dashed:o,transparent:4===v},c)))}),I=s.forwardRef(({threshold:e=15,geometry:t,...r},n)=>{let i=s.useRef(null);s.useImperativeHandle(n,()=>i.current,[]);let a=s.useMemo(()=>[0,0,0,1,0,0],[]),o=s.useRef(null),l=s.useRef(null);return s.useLayoutEffect(()=>{let r=i.current.parent,n=null!=t?t:null==r?void 0:r.geometry;if(!n||o.current===n&&l.current===e)return;o.current=n,l.current=e;let s=new u.nC(n,e).attributes.position.array;i.current.geometry.setPositions(s),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),s.createElement(k,(0,d.f)({segments:!0,points:a,ref:i,raycast:()=>null},r))});var H=e.i(43257),N=e.i(13905);let W=s.forwardRef(({light:e,args:t,map:r,toneMapped:n=!1,color:i="white",form:a="rect",intensity:o=1,scale:l=1,target:c=[0,0,0],children:f,...h},p)=>{let m=s.useRef(null);return s.useImperativeHandle(p,()=>m.current,[]),s.useLayoutEffect(()=>{f||h.material||((0,N.f)(m.current.material,{color:i}),m.current.material.color.multiplyScalar(o))},[i,o,f,h.material]),s.useLayoutEffect(()=>{h.rotation||m.current.quaternion.identity(),c&&!h.rotation&&("boolean"==typeof c?m.current.lookAt(0,0,0):m.current.lookAt(Array.isArray(c)?new u.cE(...c):c))},[c,h.rotation]),l=Array.isArray(l)&&2===l.length?[l[0],l[1],1]:l,s.createElement("mesh",(0,d.f)({ref:m,scale:l},h),"circle"===a?s.createElement("ringGeometry",{args:t||[0,.5,64]}):"ring"===a?s.createElement("ringGeometry",{args:t||[.25,.5,64]}):"rect"===a||"plane"===a?s.createElement("planeGeometry",{args:t||[1,1]}):"box"===a?s.createElement("boxGeometry",{args:t||[1,1,1]}):s.createElement(a,{args:t}),f||s.createElement("meshBasicMaterial",{toneMapped:n,map:r,side:u.Vs}),e&&s.createElement("pointLight",(0,d.f)({castShadow:!0},e)))});var V=e.i(30297),F=e.i(63219),J=e.i(79877),q=e.i(34297),$=e.i(14858);let Z=.34*$.J,K=[{x:-4.4,z:-.6,delay:0},{x:4.2,z:-2.6,delay:.35}],Q={crown:[K[0].x,Z+2.6,K[0].z],breakout:[-1.5,.6,5.5],mlcp:[-9,3.6,-6],open:[8.5,.6,3.5]};function X(e){let t=e;return()=>(t=16807*t%0x7fffffff)/0x7fffffff}let Y=e=>1+2.70158*Math.pow(e-1,3)+1.70158*Math.pow(e-1,2),ee=e=>Math.min(1,Math.max(0,e)),et=(e,t,r,n,i,s)=>Math.abs(e-r)<=i&&Math.abs(t-n)<=s,er=(()=>{let e=[];for(let t=0;t<11;t++)for(let r=0;r<8;r++){let n=-10+2*t,i=-7+2*r,s="lawn";K.some(e=>et(n,i,e.x,e.z,2.7,2.2))&&(s="stone"),et(n,i,-9,-6,2,2)&&(s="stone"),(5===t||4===r&&t>5)&&(s="stone"),(2===n||4===n)&&5===i&&(s="water"),e.push({x:n,z:i,kind:s,delay:.1+Math.hypot(n,i)/14*.9})}return e})(),en=(()=>{let e=X(9),t=[];for(let r of er){if("lawn"!==r.kind)continue;let n=.55>e()?.4>e()?2:1:0;for(let i=0;i<n;i++)t.push({x:r.x+(e()-.5)*1.3,z:r.z+(e()-.5)*1.3,s:.7+.5*e(),delay:1.1+.8*e(),tone:e()})}return t})(),ei=[-6,-2,2,6].flatMap(e=>[[-1,e],[1,e]]),es=(n=X(21),K.map(()=>Array.from({length:$.J},()=>n()))),ea=(e,t)=>ee((e-1.7-K[t].delay)/(.105*$.J))*$.J;function eo({clockRef:e,nightRef:t,night:r,replayKey:n,built:i,onProgress:a,onBuilt:l}){let c=(0,s.useRef)(n);return(0,o.f)((s,o)=>{let d=e.current;c.current!==n&&(c.current=n,d.t=0,d.floors=0),d.t+=Math.min(o,.1);let f=Math.floor(ea(d.t,0));f!==d.floors&&(d.floors=f,a(f)),!i&&ea(d.t-.5-1,1)>=$.J&&l(),t.current=u.rB.damp(t.current,+!!r,1.6,o)}),null}function el({nightRef:e}){let t=(0,s.useRef)(null),r=(0,s.useMemo)(()=>({uNight:{value:0}}),[]);return(0,o.f)(()=>{let r=t.current;r&&(r.uniforms.uNight.value=e.current)}),(0,i.jsxs)("mesh",{renderOrder:-1,scale:300,children:[(0,i.jsx)("sphereGeometry",{args:[1,32,16]}),(0,i.jsx)("shaderMaterial",{ref:t,side:u.tw,depthWrite:!1,uniforms:r,vertexShader:`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,fragmentShader:`
          uniform float uNight;
          varying vec3 vDir;
          void main() {
            float h = clamp(vDir.y, -1.0, 1.0);
            vec3 duskTop = vec3(0.20, 0.33, 0.55);
            vec3 duskMid = vec3(0.86, 0.66, 0.60);
            vec3 duskLow = vec3(1.00, 0.80, 0.60);
            vec3 nightTop = vec3(0.01, 0.02, 0.06);
            vec3 nightMid = vec3(0.03, 0.06, 0.14);
            vec3 nightLow = vec3(0.06, 0.09, 0.18);
            vec3 top = mix(duskTop, nightTop, uNight);
            vec3 mid = mix(duskMid, nightMid, uNight);
            vec3 low = mix(duskLow, nightLow, uNight);
            vec3 col = h > 0.15 ? mix(mid, top, smoothstep(0.15, 0.7, h)) : mix(low, mid, smoothstep(-0.25, 0.15, h));
            gl_FragColor = vec4(col, 1.0);
          }`})]})}function ec({nightRef:e}){let t=(0,s.useRef)(null),r=(0,s.useRef)(null),n=(0,s.useMemo)(()=>new u.Es("#ffd2a8"),[]),a=(0,s.useMemo)(()=>new u.Es("#8fa9e8"),[]);return(0,o.f)(()=>{let i=e.current;t.current&&(t.current.intensity=1.05-.75*i),r.current&&(r.current.intensity=2.6-2.05*i,r.current.color.lerpColors(n,a,i))}),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("hemisphereLight",{ref:t,args:["#fff1e2","#8a9bb4",1.05]}),(0,i.jsx)("directionalLight",{ref:r,position:[-18,22,14],intensity:2.6,castShadow:!0,"shadow-mapSize":[2048,2048],"shadow-bias":-4e-4,"shadow-normalBias":.03,"shadow-camera-left":-26,"shadow-camera-right":26,"shadow-camera-top":26,"shadow-camera-bottom":-26,"shadow-camera-far":90}),(0,i.jsx)("directionalLight",{position:[18,8,-14],intensity:.5,color:"#c9d8ff"})]})}function ed({clockRef:e}){let{lawn:t,stone:r}=(0,s.useMemo)(()=>{let e=e=>{let t=document.createElement("canvas");t.width=t.height=128,e(t.getContext("2d"));let r=new u.Nk(t);return r.colorSpace=u.nj,r.anisotropy=4,r};return{lawn:e(e=>{e.fillStyle="#6ea85a",e.fillRect(0,0,128,128);let t=X(4);for(let r=0;r<900;r++)e.fillStyle=t()>.5?"rgba(140,190,100,0.35)":"rgba(70,120,60,0.3)",e.fillRect(128*t(),128*t(),2,2);for(let t=0;t<128;t+=32)e.fillStyle="rgba(255,255,255,0.05)",e.fillRect(t,0,16,128)}),stone:e(e=>{e.fillStyle="#e7e0d3",e.fillRect(0,0,128,128),e.strokeStyle="rgba(120,110,95,0.35)",e.lineWidth=1.5;for(let t=0;t<=128;t+=32){e.beginPath(),e.moveTo(0,t),e.lineTo(128,t),e.stroke();for(let r=t/32%2?0:32;r<=128;r+=64)e.beginPath(),e.moveTo(r,t),e.lineTo(r,t+32),e.stroke()}})}},[]),n=(0,s.useMemo)(()=>new u.kG(1.97,.8,1.97),[]),a=(0,s.useMemo)(()=>new u.aV({color:"#5d4632",roughness:.95}),[]),o=(0,s.useMemo)(()=>({lawn:[a,a,new u.aV({map:t,roughness:.95}),a,a,a],stone:[a,a,new u.aV({map:r,roughness:.7}),a,a,a],water:[a,a,new u.aV({color:"#3d9fc9",roughness:.05,metalness:.4,envMapIntensity:1.6}),a,a,a]}),[a,t,r]);return(0,i.jsx)(i.Fragment,{children:["lawn","stone","water"].map(t=>(0,i.jsx)(eu,{tiles:er.filter(e=>e.kind===t),geometry:n,material:o[t],clockRef:e,sink:.14*("water"===t)},t))})}function eu({tiles:e,geometry:t,material:r,clockRef:n,sink:a}){let l=(0,s.useRef)(null),c=(0,s.useMemo)(()=>new u.t,[]);return(0,o.f)(()=>{let t=l.current,r=n.current.t;t&&!(r>3.5)&&(e.forEach((e,n)=>{let i=ee((r-e.delay)/.6),s=0===i?0:Y(i);c.position.set(e.x,-.4-a+-((1-s)*2.5),e.z),c.scale.setScalar(0===i?.001:.5+.5*s),c.updateMatrix(),t.setMatrixAt(n,c.matrix)}),t.instanceMatrix.needsUpdate=!0)}),(0,i.jsx)("instancedMesh",{ref:l,args:[t,r,e.length],castShadow:!0,receiveShadow:!0,frustumCulled:!1})}function ef({clockRef:e}){let t=(0,s.useRef)(null),r=(0,s.useRef)(null),n=(0,s.useMemo)(()=>new u.t,[]),a=(0,s.useMemo)(()=>{let e=["#4f8a45","#5f9a4f","#6fa95a","#467d3e"].map(e=>new u.Es(e)),t=new Float32Array(3*en.length);return en.forEach((r,n)=>e[Math.floor(r.tone*e.length)].toArray(t,3*n)),new u.VZ(t,3)},[]);return(0,o.f)(()=>{let i=e.current.t;if(!(i>4))for(let e of(en.forEach((e,s)=>{let a=ee((i-e.delay)/.5),o=Math.max(.001,0===a?0:Y(a)*e.s);n.position.set(e.x,.35*o,e.z),n.scale.setScalar(o),n.updateMatrix(),t.current?.setMatrixAt(s,n.matrix),n.position.set(e.x,1.05*o,e.z),n.scale.set(o,1.1*o,o),n.updateMatrix(),r.current?.setMatrixAt(s,n.matrix)}),[t,r]))e.current&&(e.current.instanceMatrix.needsUpdate=!0)}),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("instancedMesh",{ref:t,args:[void 0,void 0,en.length],castShadow:!0,frustumCulled:!1,children:[(0,i.jsx)("cylinderGeometry",{args:[.06,.09,.7,6]}),(0,i.jsx)("meshStandardMaterial",{color:"#5b4332"})]}),(0,i.jsxs)("instancedMesh",{ref:r,args:[void 0,void 0,en.length],castShadow:!0,frustumCulled:!1,instanceColor:a,children:[(0,i.jsx)("icosahedronGeometry",{args:[.6,1]}),(0,i.jsx)("meshStandardMaterial",{roughness:.9})]})]})}function eh({clockRef:e,nightRef:t}){let r=(0,s.useRef)(null),n=(0,s.useRef)(null);return(0,o.f)(()=>{let i=ee((e.current.t-1.4)/.5);r.current?.scale.set(1,Math.max(.001,i),1),r.current&&(r.current.visible=i>0);let s=t.current;n.current?.color.setRGB(1+3*s,.9+2.2*s,.7+1.2*s)}),(0,i.jsx)("group",{ref:r,children:ei.map(([e,t],r)=>(0,i.jsxs)("group",{position:[e,0,t],children:[(0,i.jsxs)("mesh",{"position-y":.35,castShadow:!0,children:[(0,i.jsx)("cylinderGeometry",{args:[.03,.04,.7,6]}),(0,i.jsx)("meshStandardMaterial",{color:"#2f3640",metalness:.6,roughness:.4})]}),(0,i.jsxs)("mesh",{"position-y":.74,children:[(0,i.jsx)("sphereGeometry",{args:[.08,10,8]}),(0,i.jsx)("meshBasicMaterial",{ref:0===r?n:void 0,color:"#fff1cc",toneMapped:!1})]})]},r))})}function ep({clockRef:e}){let t=(0,s.useRef)(null);return(0,o.f)(()=>{let r=ee((e.current.t-1.2)/.7),n=0===r?.001:Y(r);t.current?.scale.set(1,Math.max(.001,n),1),t.current&&(t.current.visible=r>0)}),(0,i.jsxs)("group",{ref:t,position:[-9,0,-6],children:[(0,i.jsx)(F.f,{args:[3.6,3,3.4],radius:.06,"position-y":1.5,castShadow:!0,receiveShadow:!0,children:(0,i.jsx)("meshStandardMaterial",{color:"#47515f",roughness:.6})}),[.45,1.2,1.95,2.7].map(e=>(0,i.jsx)(F.f,{args:[3.75,.14,3.55],radius:.04,"position-y":e,castShadow:!0,receiveShadow:!0,children:(0,i.jsx)("meshStandardMaterial",{color:"#efeae0",roughness:.6})},e)),Array.from({length:9},(e,t)=>(0,i.jsxs)("mesh",{position:[-1.6+.4*t,1.5,1.76],castShadow:!0,children:[(0,i.jsx)("boxGeometry",{args:[.07,2.9,.07]}),(0,i.jsx)("meshStandardMaterial",{color:"#a8774c",roughness:.6})]},t)),(0,i.jsxs)("mesh",{"position-y":3.08,children:[(0,i.jsx)("boxGeometry",{args:[3.5,.12,3.3]}),(0,i.jsx)("meshStandardMaterial",{color:"#6ea85a",roughness:.95})]})]})}function em({index:e,clockRef:t,nightRef:r}){let n=K[e],a=(0,s.useRef)(null),l=(0,s.useRef)(null),c=(0,s.useRef)(null),d=(0,s.useRef)(null),f=(0,s.useRef)(null),h=(0,s.useRef)(null),p=(0,s.useRef)(null),m=(0,s.useRef)(null),x=(0,s.useRef)(null),g=(0,s.useRef)(null),y=(0,s.useRef)(null),v=(0,s.useRef)(null),w=(0,s.useMemo)(()=>new u.t,[]),S=(0,s.useRef)(!1),b=(0,s.useMemo)(()=>new q.f(4.42,.045,3.2+.22,2,.015),[]),M=(0,s.useMemo)(()=>{let t=new Float32Array(3*$.J);return es[e].forEach((e,r)=>{let n=e<.7?.65+.5*e:.08;t.set([n,.92*n,.8*n],3*r)}),new u.VZ(t,3)},[e]);return(0,o.f)(({clock:i})=>{let s=t.current.t,o=r.current;h.current?.color.setRGB(.06+2.6*o,.07+1.9*o,.09+1.05*o),p.current&&(p.current.opacity=.88-.4*o),m.current?.emissive.setRGB(.25+.75*o,.13+.4*o,.04+.12*o),y.current?.color.setRGB(1.2+2.2*o,.95+1.6*o,.65+.8*o),v.current?.color.setRGB(Math.sin(3*i.elapsedTime)>.2?3:.4,.15,.1);let u=ea(s,e),b=u<$.J||s<1.7+n.delay+.105*$.J+.5+.2;if(!b&&S.current)return;S.current=!b;for(let e=0;e<$.J;e++){let t=ee((s-1.7-n.delay-.105*e)/.5),r=0===t?0:Y(t),i=.34*e+(1-r)*1.6,o=0===t?.001:1,u=(t,r)=>{t&&(w.position.set(n.x,i+r,n.z),w.scale.setScalar(o),w.updateMatrix(),t.setMatrixAt(e,w.matrix))};u(a.current,.34),u(l.current,.34-.05),u(c.current,.17),u(d.current,.17),u(f.current,.09)}for(let e of[a,l,c,d,f])e.current&&(e.current.instanceMatrix.needsUpdate=!0);x.current?.scale.set(1,Math.max(.001,Math.min($.J,u)/$.J),1);let M=ee((s-1.7-n.delay-.105*$.J-.1)/.6);g.current?.scale.set(1,Math.max(.001,0===M?0:Y(M)),1),g.current&&(g.current.visible=M>0)}),(0,i.jsxs)("group",{children:[(0,i.jsx)("instancedMesh",{ref:a,args:[b,void 0,$.J],castShadow:!0,receiveShadow:!0,frustumCulled:!1,children:(0,i.jsx)("meshStandardMaterial",{color:"#f1ede6",roughness:.5})}),(0,i.jsxs)("instancedMesh",{ref:l,args:[void 0,void 0,$.J],frustumCulled:!1,children:[(0,i.jsx)("boxGeometry",{args:[4.4,.02,3.2+.2]}),(0,i.jsx)("meshStandardMaterial",{ref:m,color:"#b57d4b",roughness:.6,emissive:"#3f2007"})]}),(0,i.jsxs)("instancedMesh",{ref:d,args:[void 0,void 0,$.J],frustumCulled:!1,instanceColor:M,children:[(0,i.jsx)("boxGeometry",{args:[3.96,.34-.1,2.96]}),(0,i.jsx)("meshBasicMaterial",{ref:h,toneMapped:!1})]}),(0,i.jsxs)("instancedMesh",{ref:c,args:[void 0,void 0,$.J],castShadow:!0,frustumCulled:!1,children:[(0,i.jsx)("boxGeometry",{args:[4.12,.34-.045,3.12]}),(0,i.jsx)("meshStandardMaterial",{ref:p,color:"#2b5480",metalness:.65,roughness:.07,envMapIntensity:3,transparent:!0,opacity:.88,depthWrite:!1})]}),(0,i.jsxs)("instancedMesh",{ref:f,args:[void 0,void 0,$.J],frustumCulled:!1,children:[(0,i.jsx)("boxGeometry",{args:[4.41,.07,3.41]}),(0,i.jsx)("meshStandardMaterial",{color:"#d6ecff",metalness:.2,roughness:.05,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:1.5})]}),(0,i.jsxs)("group",{ref:x,position:[n.x,0,n.z],"scale-y":.001,children:[[-1,1].flatMap(e=>[-1,1].map(t=>(0,i.jsxs)("mesh",{position:[4.2*e/2,Z/2,3.2*t/2],castShadow:!0,children:[(0,i.jsx)("boxGeometry",{args:[.16,Z,.16]}),(0,i.jsx)("meshStandardMaterial",{color:"#e9e4da",roughness:.5})]},`c${e}${t}`))),[-1.5,-1,-.5,.5,1,1.5].flatMap(e=>[-1,1].map(t=>(0,i.jsxs)("mesh",{position:[e,Z/2,3.2*t/2+.06*t],children:[(0,i.jsx)("boxGeometry",{args:[.03,Z,.08]}),(0,i.jsx)("meshStandardMaterial",{color:"#c3ccd6",metalness:.8,roughness:.3})]},`f${e}${t}`))),[-1.05,-.35,.35,1.05].flatMap(e=>[-1,1].map(t=>(0,i.jsxs)("mesh",{position:[4.2*t/2+.06*t,Z/2,e],children:[(0,i.jsx)("boxGeometry",{args:[.08,Z,.03]}),(0,i.jsx)("meshStandardMaterial",{color:"#c3ccd6",metalness:.8,roughness:.3})]},`s${e}${t}`))),[-1,1].map(e=>(0,i.jsxs)("mesh",{position:[0,Z/2,3.2*e/2+.1*e],children:[(0,i.jsx)("boxGeometry",{args:[.05,Z,.05]}),(0,i.jsx)("meshBasicMaterial",{color:[2.6,1.8,.9],toneMapped:!1})]},`led${e}`))]}),(0,i.jsxs)("group",{ref:g,position:[n.x,Z+.34,n.z],"scale-y":.001,visible:!1,children:[(0,i.jsx)(F.f,{args:[.92*4.2,.3,.92*3.2],radius:.05,"position-y":.15,castShadow:!0,children:(0,i.jsx)("meshStandardMaterial",{color:"#f3efe8",roughness:.5})}),(0,i.jsxs)("mesh",{"position-y":.85,children:[(0,i.jsx)("boxGeometry",{args:[2.94,1,.7*3.2]}),(0,i.jsx)("meshBasicMaterial",{ref:y,color:"#ffd9a0",toneMapped:!1})]}),(0,i.jsxs)("mesh",{"position-y":.85,children:[(0,i.jsx)("boxGeometry",{args:[3.024,1.02,2.304]}),(0,i.jsx)("meshStandardMaterial",{color:"#2a4561",metalness:.8,roughness:.05,envMapIntensity:2,transparent:!0,opacity:.45,depthWrite:!1})]}),(0,i.jsx)(F.f,{args:[.8*4.2,.14,.8*3.2],radius:.04,"position-y":1.42,castShadow:!0,children:(0,i.jsx)("meshStandardMaterial",{color:"#c49a52",metalness:.7,roughness:.3})}),(0,i.jsxs)("mesh",{"position-y":2,castShadow:!0,children:[(0,i.jsx)("cylinderGeometry",{args:[.03,.045,1,6]}),(0,i.jsx)("meshStandardMaterial",{color:"#c49a52",metalness:.7,roughness:.3})]}),(0,i.jsxs)("mesh",{"position-y":2.55,children:[(0,i.jsx)("sphereGeometry",{args:[.09,10,8]}),(0,i.jsx)("meshBasicMaterial",{ref:v,color:"#ff3b30",toneMapped:!1})]})]})]})}function ex({clockRef:e}){let t=(0,s.useRef)(null),r=(0,s.useRef)(null),n=(0,s.useRef)(null),a=K[0];return(0,o.f)(()=>{let i=e.current.t,s=.34*ea(i,0)+2.4;r.current?.scale.set(1,s,1),n.current?.position.set(0,s,0),n.current?.rotation.set(0,.8*Math.sin(.7*i)+.4,0);let a=ee((i-1.3)/.5),o=ee((i-1.7-.105*$.J-.8)/.7),l=(0===a?0:Y(a))*(1-o);t.current?.scale.setScalar(Math.max(.001,l)),t.current&&(t.current.visible=l>.01)}),(0,i.jsxs)("group",{ref:t,position:[a.x-2.1-1.1,0,a.z+1.6+.6],children:[(0,i.jsx)("group",{ref:r,children:(0,i.jsxs)("mesh",{"position-y":.5,castShadow:!0,children:[(0,i.jsx)("boxGeometry",{args:[.36,1,.36]}),(0,i.jsx)("meshStandardMaterial",{color:"#f2b632",wireframe:!0})]})}),(0,i.jsxs)("group",{ref:n,children:[(0,i.jsxs)("mesh",{position:[2.6,.15,0],castShadow:!0,children:[(0,i.jsx)("boxGeometry",{args:[7,.22,.26]}),(0,i.jsx)("meshStandardMaterial",{color:"#f2b632",roughness:.5})]}),(0,i.jsxs)("mesh",{position:[-1.4,0,0],castShadow:!0,children:[(0,i.jsx)("boxGeometry",{args:[.9,.5,.55]}),(0,i.jsx)("meshStandardMaterial",{color:"#5d6b80"})]}),(0,i.jsxs)("mesh",{position:[0,.45,0],castShadow:!0,children:[(0,i.jsx)("boxGeometry",{args:[.45,.5,.45]}),(0,i.jsx)("meshStandardMaterial",{color:"#f2b632"})]}),(0,i.jsxs)("mesh",{position:[4.8,-.9,0],children:[(0,i.jsx)("boxGeometry",{args:[.025,2,.025]}),(0,i.jsx)("meshStandardMaterial",{color:"#2b3340"})]}),(0,i.jsx)(F.f,{args:[.9,.3,.6],radius:.05,position:[4.8,-2,0],castShadow:!0,children:(0,i.jsx)("meshStandardMaterial",{color:"#c49a52"})})]})]})}function eg({floor:e}){let t=(0,s.useRef)(null);return(0,o.f)((r,n)=>{let i=t.current;i&&(i.position.set(0,u.rB.damp(i.position.y,(e??1)*.34-.17,6,n),0),i.visible=null!==e)}),(0,i.jsx)("group",{ref:t,visible:!1,children:K.map((e,t)=>(0,i.jsxs)("mesh",{position:[e.x,0,e.z],children:[(0,i.jsx)("boxGeometry",{args:[4.95,1.1*.34,3.95]}),(0,i.jsx)("meshBasicMaterial",{color:[2,1.45,.7],transparent:!0,opacity:.4,toneMapped:!1,depthWrite:!1}),(0,i.jsx)(I,{color:"#ffd38a",threshold:15})]},t))})}let ey="towers-spin";function ev({enabled:e,children:t}){let r=(0,s.useRef)(null);return(0,o.f)((t,n)=>{e&&r.current?.rotateY(.12*n)}),(0,i.jsx)("group",{ref:r,name:ey,children:t})}function ew({clockRef:e,built:t,touch:r}){let n=(0,l.f)(e=>e.camera),a=(0,s.useRef)(new u.cE(0,1,0)),c=r?66:54;return((0,o.f)((i,s)=>{if(t&&!r)return;let o=e.current.t,l=ea(o,0)/$.J,d=t?.72:.55+.03*o,f=new u.cE(Math.sin(d)*c,18+14*l,Math.cos(d)*c);n.position.lerp(f,1-Math.exp(-(1.5*s))),a.current.lerp(new u.cE(0,1+7*l,0),1-Math.exp(-(1.5*s))),n.lookAt(a.current)}),!t||r)?null:(0,i.jsx)(V.f,{target:[0,8,0],enableZoom:!1,enablePan:!1,enableDamping:!0,autoRotate:!0,autoRotateSpeed:.45,minPolarAngle:Math.PI/6,maxPolarAngle:Math.PI/2.4})}function eS({hotspotsRef:e,visible:t}){let{camera:r,size:n,scene:i}=(0,l.f)(),a=(0,s.useMemo)(()=>$.u.map(e=>new u.cE(...Q[e.id])),[]),c=(0,s.useMemo)(()=>new u.cE,[]);return(0,o.f)(()=>{let s=i.getObjectByName(ey),o=n.width-(n.width<640?130:150);a.forEach((i,a)=>{let l=e.current[a];if(!l)return;let d=c.copy(i);s&&d.applyMatrix4(s.matrixWorld),d.project(r);let u=(.5*d.x+.5)*n.width,f=(-(.5*d.y)+.5)*n.height,h=t&&d.z<1&&u<o&&f>40&&f<n.height-30;l.style.transform=`translate(-50%, -50%) translate(${u}px, ${f}px)`,l.style.opacity=h?"1":"0",l.style.pointerEvents=h?"auto":"none"})}),null}e.s(["default",0,function({active:e,replayKey:t,night:r,selectedFloor:n,onProgress:o,hotspotsRef:l}){let d=(0,s.useMemo)(()=>window.matchMedia("(pointer: coarse)").matches,[]),u=(0,s.useRef)({t:0,floors:0}),f=(0,s.useRef)(0),[h,p]=(0,s.useState)(!1),[m,x]=(0,s.useState)(t);return t!==m&&(x(t),p(!1)),(0,i.jsxs)(a.f,{shadows:"soft",frameloop:e?"always":"never",dpr:d?[1,1.5]:[1,2],camera:{position:[38,30,44],fov:26,near:1,far:400},gl:{antialias:!1},children:[(0,i.jsx)(eo,{clockRef:u,nightRef:f,night:r,replayKey:t,built:h,onProgress:o,onBuilt:()=>p(!0)}),(0,i.jsx)(el,{nightRef:f}),(0,i.jsx)(ec,{nightRef:f}),(0,i.jsxs)(H.f,{resolution:256,frames:1,children:[(0,i.jsx)(W,{form:"rect",intensity:2.4,color:"#ffc596",position:[0,6,-40],scale:[80,14,1]}),(0,i.jsx)(W,{form:"rect",intensity:1.4,color:"#a9c6ff",position:[40,26,10],"rotation-y":-Math.PI/2,scale:[50,16,1]}),(0,i.jsx)(W,{form:"rect",intensity:1,color:"#ffffff",position:[-40,30,20],"rotation-y":Math.PI/2,scale:[40,12,1]}),(0,i.jsx)(W,{form:"circle",intensity:2,color:"#ffffff",position:[0,60,0],"rotation-x":Math.PI/2,scale:18})]}),(0,i.jsxs)(ev,{enabled:d&&h,children:[(0,i.jsx)(ed,{clockRef:u}),(0,i.jsx)(ef,{clockRef:u}),(0,i.jsx)(eh,{clockRef:u,nightRef:f}),(0,i.jsx)(ep,{clockRef:u}),K.map((e,t)=>(0,i.jsx)(em,{index:t,clockRef:u,nightRef:f},t)),(0,i.jsx)(ex,{clockRef:u}),(0,i.jsx)(eg,{floor:n})]}),(0,i.jsx)(c.f,{position:[0,-.8-.02,0],scale:70,blur:2.8,far:12,opacity:.4,color:"#1d2b3f"}),(0,i.jsx)(ew,{clockRef:u,built:h,touch:d}),(0,i.jsx)(eS,{hotspotsRef:l,visible:h}),(0,i.jsxs)(J.g,{multisampling:4*!d,children:[d?(0,i.jsx)(i.Fragment,{}):(0,i.jsx)(J.v,{aoRadius:1.4,intensity:1.8,distanceFalloff:1,halfRes:!0,quality:"medium"}),(0,i.jsx)(J.w,{mipmapBlur:!0,intensity:.75,luminanceThreshold:.92,luminanceSmoothing:.2})]})]})}],252)},59785,function(e){e.n(e.i(252))}]);