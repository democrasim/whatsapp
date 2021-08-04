import { Law, Member, Prosecution } from "@/types";

export function prosecutionExplanation(prosecution:Prosecution, judge:Member){
    return `ברוכים הבאים לבית המשפט
    ${prosecution.prosecutor.name} הגיש תביעה נגד ${prosecution.prosecuted.name}
    על הפרת חוק מספר ${prosecution.law.number} סעיף ${prosecution.section}
    שהוא ${prosecution.content.description}
    ראיות התובע: ${prosecution.info}
    כעת השופט ${judge.name} ידון איתכם`;
}

export function prosecutionGroupName(prosecution:Prosecution){
    return `תביעה- חוק ${prosecution.law.number}.${prosecution.section}`
}