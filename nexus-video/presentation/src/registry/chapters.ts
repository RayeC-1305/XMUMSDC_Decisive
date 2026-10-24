import type {ChapterDef} from "./types";
import Opening from '../chapters/01-opening/Opening';
import {narrations as n0,durations as d0} from '../chapters/01-opening/narrations';
import Decision from '../chapters/02-workers-decision/Decision';
import {narrations as n1,durations as d1} from '../chapters/02-workers-decision/narrations';
import Loop from '../chapters/03-product-loop/Loop';
import {narrations as n2,durations as d2} from '../chapters/03-product-loop/narrations';
import Reasons from '../chapters/04-explainable-directions/Reasons';
import {narrations as n3,durations as d3} from '../chapters/04-explainable-directions/narrations';
import Evidence from '../chapters/05-evidence-and-assumptions/Evidence';
import {narrations as n4,durations as d4} from '../chapters/05-evidence-and-assumptions/narrations';
import LiveDemo from '../chapters/06-reviewable-change/LiveDemo';
import {narrations as n5,durations as d5} from '../chapters/06-reviewable-change/narrations';
import Practice from '../chapters/07-practical-next-step/Practice';
import {narrations as n6,durations as d6} from '../chapters/07-practical-next-step/narrations';
import Architecture from '../chapters/08-working-prototype/Architecture';
import {narrations as n7,durations as d7} from '../chapters/08-working-prototype/narrations';
import Pilot from '../chapters/09-buyer-and-pilot/Pilot';
import {narrations as n8,durations as d8} from '../chapters/09-buyer-and-pilot/narrations';
import Invitation from '../chapters/10-team-and-invitation/Invitation';
import {narrations as n9,durations as d9} from '../chapters/10-team-and-invitation/narrations';
export const CHAPTERS: ChapterDef[] = [
 {id:"opening",title:"Plans evolve. Progress stays.",narrations:n0,durations:d0,Component:Opening},
 {id:"workers-decision",title:"The problem is choosing what to learn next",narrations:n1,durations:d1,Component:Decision},
 {id:"product-loop",title:"A reviewable reskilling workspace",narrations:n2,durations:d2,Component:Loop},
 {id:"explainable-directions",title:"Every match has a reason",narrations:n3,durations:d3,Component:Reasons},
 {id:"evidence-and-assumptions",title:"The source behind the signal",narrations:n4,durations:d4,Component:Evidence},
 {id:"reviewable-change",title:"A new direction. Your learning stays.",narrations:n5,durations:d5,Component:LiveDemo},
 {id:"practical-next-step",title:"A plan you can act on",narrations:n6,durations:d6,Component:Practice},
 {id:"working-prototype",title:"From CV to decision, with explainable rules",narrations:n7,durations:d7,Component:Architecture},
 {id:"buyer-and-pilot",title:"Expected impact, measured in a pilot",narrations:n8,durations:d8,Component:Pilot},
 {id:"team-and-invitation",title:"Make the next learning decision reviewable",narrations:n9,durations:d9,Component:Invitation}
];
