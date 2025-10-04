#views.py
#Quickly render random verses
from django.shortcuts import render
import random


# 🤎 Anxious Jar - Verses for anxiety, worry, and fear
Eng_anxious_verses = [
    "3:54 🔓 And the disbelievers planned, but Allah planned. And Allah is the best of planners.",
    "8:30 🔓 And [remember, O Muhammad], when those who disbelieved plotted against you to restrain you or kill you or evict you [from Makkah]. But they plan, and Allah plans. And Allah is the best of planners.",
    "13:28 🔓 Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
    "2:45 🔓 And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah].",
    "94:5-6 🔓 For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    "2:286 🔓 Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. 'Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.'",
    "64:11 🔓 No disaster strikes except by permission of Allah. And whoever believes in Allah - He will guide his heart. And Allah is Knowing of all things.",
    "65:3 🔓 And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
    "20:46 🔓 [Allah] said, 'Fear not. Indeed, I am with you both; I hear and I see.'",
    "3:173 🔓 Those to whom hypocrites said, 'Indeed, the people have gathered against you, so fear them.' But it [merely] increased them in faith, and they said, 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.'",
    "9:40 🔓 If you do not aid the Prophet - Allah has already aided him when those who disbelieved had driven him out [of Makkah] as one of two, when they were in the cave and he said to his companion, 'Do not grieve; indeed Allah is with us.' And Allah sent down his tranquillity upon him and supported him with angels you did not see and made the word of those who disbelieved the lowest, while the word of Allah - that is the highest. And Allah is Exalted in Might and Wise.",
    "4:81 🔓 And they say, '[We pledge] obedience.' But when they leave you, a group of them spend the night determining to do other than what you say. But Allah records what they plan by night. So turn away from them and rely upon Allah. And sufficient is Allah as Disposer of affairs.",
    "9:51 🔓 Say, 'Never will we be struck except by what Allah has decreed for us; He is our protector.' And upon Allah let the believers rely.",
    "50:16 🔓 And We have already created man and know what his soul whispers to him, and We are closer to him than [his] jugular vein.",
    "42:28 🔓 And it is He who sends down the rain after [people] have despaired and spreads His mercy. And He is the Protector, the Praiseworthy.",
    "3:159 🔓 So by mercy from Allah, [O Muhammad], you were lenient with them. And if you had been rude [in speech] and harsh in heart, they would have disbanded from about you. So pardon them and ask forgiveness for them and consult them in the matter. And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely [upon Him].",
    "33:3 🔓 And follow that which is revealed to you from your Lord and follow [the guidance of] Allah and His Messenger. And Allah is ever, with what you do, Acquainted.",
    "12:64 🔓 He said, 'Should I entrust you with him except [under coercion] as I entrusted you with his brother before? But Allah is the best guardian, and He is the most merciful of the merciful.'",
    "2:216 🔓 Fighting has been enjoined upon you while it is hateful to you. But perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. And Allah knows, while you know not.",
    "3:139 🔓 So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    "16:127 🔓 And be patient, [O Muhammad], and your patience is not but through Allah. And do not grieve over them and do not be in distress over what they conspire.",
    "29:2-3 🔓 Do the people think that they will be left to say, 'We believe' and they will not be tried? But We have certainly tried those before them, and Allah will surely make evident those who are truthful, and He will surely make evident the liars.",
    "23:115 🔓 Then did you think that We created you uselessly and that to Us you would not be returned?",
    "67:2 🔓 [He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving.",
    "2:214 🔓 Or do you think that you will enter Paradise while such [trial] has not yet come to you as came to those who passed on before you? They were touched by poverty and hardship and were shaken until [even their] messenger and those who believed with him said, 'When is the help of Allah?' Unquestionably, the help of Allah is near.",
    "2:155-156 🔓 And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient, Who, when disaster strikes them, say, 'Indeed we belong to Allah, and indeed to Him we will return.'",
    "2:153 🔓 O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    "7:200 🔓 And if an evil suggestion comes to you from Satan, then seek refuge in Allah. Indeed, He is Hearing and Knowing.",
    "4:58 🔓 Indeed, Allah orders you to render trusts to whom they are due and when you judge between people to judge with justice. Excellent is that which Allah instructs you. Indeed, Allah is ever Hearing and Seeing.", 
    "17:110 🔓 Say, 'Call upon Allah or call upon the Most Merciful. Whichever [name] you call - to Him belong the best names.' And do not recite [too] loudly in your prayer or [too] quietly but seek between that an [intermediate] way."
]

# 🩷 Happy Jar - Verses for joy, celebration, and contentment
Eng_happy_verses = [
    "10:58 🔓 Say, 'In the bounty of Allah and in His mercy - in that let them rejoice; it is better than what they accumulate.'",
    "16:97 🔓 Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life, and We will surely give them their reward [in the Hereafter] according to the best of what they used to do.",
    "16:78 🔓 And Allah has extracted you from the wombs of your mothers not knowing a thing, and He made for you hearing and vision and intellect that perhaps you would be grateful.",
    "16:10-11 🔓 It is He who sends down rain from the sky; from it is drink and from it is foliage in which you pasture [animals]. He causes to grow for you thereby the crops, olives, palm trees, grapevines, and from all the fruits. Indeed in that is a sign for a people who give thought.",
    "16:80 🔓 And Allah has made for you from your homes a place of rest and made for you from the hides of the animals tents which you find light on your day of travel and your day of encampment; and from their wool, fur and hair is furnishing and provision for a time.",
    "2:186 🔓 And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me [by obedience] and believe in Me that they may be [rightly] guided.",
    "16:53 🔓 And whatever you have of favor - it is from Allah. Then when adversity touches you, to Him you cry for help.",
    "16:18 🔓 And if you should count the favors of Allah, you could not enumerate them. Indeed, Allah is Forgiving and Merciful.",
    "16:81 🔓 And Allah has made for you, from that which He has created, shadows and has made for you from the mountains, shelters and has made for you garments which protect you from the heat and garments which protect you from your [enemy in] battle. Thus does He complete His favor upon you that you might submit [to Him].",
    "21:35 🔓 Every soul will taste death. And We test you with evil and with good as trial; and to Us you will be returned.",
    "2:25 🔓 And give good tidings to those who believe and do righteous deeds that they will have gardens [in Paradise] beneath which rivers flow. Whenever they are provided with a provision of fruit therefrom, they will say, 'This is what we were provided with before.' And it is given to them in likeness. And they will have therein purified spouses, and they will abide therein eternally.",
    "18:88 🔓 But as for one who believes and does righteousness, he will have a goodly reward, and we will speak to him from our command with ease.",
    "10:25 🔓 And Allah invites to the Home of Peace and guides whom He wills to a straight path.",
    "39:53 🔓 Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
    "25:70 🔓 Except for those who repent, believe and do righteous work. For them Allah will replace their evil deeds with good. And ever is Allah Forgiving and Merciful.",
    "103:1-3 🔓 By time, Indeed, mankind is in loss, Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
    "4:69 🔓 And whoever obeys Allah and the Messenger - those will be with the ones upon whom Allah has bestowed favor of the prophets, the steadfast affirmers of truth, the martyrs and the righteous. And excellent are those as companions.",
    "9:21 🔓 Their Lord gives them good tidings of mercy from Him and approval and of gardens for them wherein is enduring pleasure.",
    "13:29 🔓 Those who have believed and done righteous deeds - a good state is theirs and a good return.",
    "32:17 🔓 And no soul knows what has been hidden for them of comfort for eyes as reward for what they used to do.",
    "36:55 🔓 Indeed the companions of Paradise, that Day, will be amused in [joyful] occupation.",
    "43:70 🔓 Enter Paradise, you and your kinds, delighted.",
    "76:11 🔓 So Allah will protect them from the evil of that Day and give them radiance and happiness.",
    "89:27-30 🔓 [To the righteous it will be said], 'O reassured soul, Return to your Lord, well-pleased and pleasing [to Him], And enter among My [righteous] servants And enter My Paradise.'",
    "48:4 🔓 It is He who sent down tranquillity into the hearts of the believers that they would increase in faith along with their [present] faith. And to Allah belong the soldiers of the heavens and the earth, and ever is Allah Knowing and Wise.",
    "24:35 🔓 Allah is the light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a brilliantly shining star lit from [the oil of] a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allah guides to His light whom He wills. And Allah presents examples for the people, and Allah is Knowing of all things.",
    "55:60 🔓 Is the reward for good [anything] but good?",
    "41:30 🔓 Indeed, those who have said, 'Our Lord is Allah' and then remained on a right course - the angels will descend upon them, [saying], 'Do not fear and do not grieve but receive good tidings of Paradise, which you were promised.'"
]

# 💛 Thankful Jar - Verses for gratitude and appreciation
Eng_thankful_verses = [
    "14:7 🔓 And [remember] when your Lord proclaimed, 'If you are grateful, I will certainly give you more. But if you are ungrateful, surely My punishment is severe.'",
    "16:78 🔓 And Allah has extracted you from the wombs of your mothers not knowing a thing, and He made for you hearing and vision and intellect that perhaps you would be grateful.",
    "2:152 🔓 So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    "2:172 🔓 O you who have believed, eat from the good things which We have provided for you and be grateful to Allah if it is [indeed] Him that you worship.",
    "27:40 🔓 Said one who had knowledge from the Scripture, 'I will bring it to you before your glance returns to you.' And when [Solomon] saw it placed before him, he said, 'This is from the favor of my Lord to test me whether I will be grateful or ungrateful. And whoever is grateful - his gratitude is only for [the benefit of] himself. And whoever is ungrateful - then indeed, my Lord is Free of need and Generous.'",
    "31:12 🔓 And We had certainly given Luqman wisdom [and said], 'Be grateful to Allah.' And whoever is grateful is grateful for [the benefit of] himself. And whoever is ungrateful - then indeed, Allah is Free of need and Praiseworthy.",
    "16:53 🔓 And whatever you have of favor - it is from Allah. Then when adversity touches you, to Him you cry for help.",
    "14:34 🔓 And He gave you from all you asked of Him. And if you should count the favor of Allah, you could not enumerate them. Indeed, mankind is [generally] most unjust and ungrateful.",
    "34:13 🔓 They made for him what he willed of elevated chambers, statues, bowls like reservoirs, and stationary kettles. [We said], 'Work, O family of David, in gratitude.' And few of My servants are grateful.",
    "3:145 🔓 And it is not [possible] for one to die except by permission of Allah at a decree determined. And whoever desires the reward of this world - We will give him thereof; and whoever desires the reward of the Hereafter - We will give him thereof. And we will reward the grateful.",
    "16:81 🔓 And Allah has made for you, from that which He has created, shadows and has made for you from the mountains, shelters and has made for you garments which protect you from the heat and garments which protect you from your [enemy in] battle. Thus does He complete His favor upon you that you might submit [to Him].",
    "27:73 🔓 And indeed, your Lord is full of bounty for the people, but most of them do not show gratitude.",
    "55:13 🔓 So which of the favors of your Lord would you deny?",
    "17:3 🔓 O descendants of those We carried [in the ship] with Noah. Indeed, he was a grateful servant.",
    "76:9 🔓 [Saying], 'We feed you only for the countenance of Allah. We wish not from you reward or gratitude.'",
    "2:243 🔓 Have you not considered those who left their homes in many thousands, fearing death? Allah said to them, 'Die'; then He restored them to life. And Allah is full of bounty to the people, but most of the people do not show gratitude.",
    "8:26 🔓 And remember when you were few and oppressed in the land, fearing that people might abduct you, but He sheltered you, supported you with His victory, and provided you with good things - that you might be grateful.",
    "35:3 🔓 O mankind, remember the favor of Allah upon you. Is there any creator other than Allah who provides for you from the heaven and earth? There is no deity except Him, so how are you deluded?",
    "16:114 🔓 Then eat of what Allah has provided for you [which is] lawful and good. And be grateful for the favor of Allah, if it is [indeed] Him that you worship.",
    "29:17 🔓 You only worship, besides Allah, idols, and you produce a falsehood. Indeed, those you worship besides Allah do not possess for you [the power of] provision, so seek from Allah provision and worship Him and be grateful to Him. To Him you will be returned.",
    "2:152 🔓 So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    "7:10 🔓 And We have certainly established you upon the earth and made for you therein ways of livelihood. Little are you grateful.",
    "6:63 🔓 Say, 'Who rescues you from the darknesses of the land and sea [when] you call upon Him imploring [aloud] and privately, 'If He should save us from this [crisis], we will surely be among the thankful.'",
    "14:5 🔓 And We certainly sent Moses with Our signs, [saying], 'Bring out your people from darknesses into the light and remind them of the days of Allah.' Indeed in that are signs for everyone patient and grateful.",
    "54:35 🔓 As favor from us. Thus do We reward whoever is grateful.", 
    "17:19 🔓 But whoever desires the Hereafter and exerts the effort due to it while he is a believer - it is those whose effort is ever appreciated [by Allah]." 
]


# 💙 Lonely Jar - Verses for companionship and connection with Allah
Eng_lonely_verses = [
    "50:16 🔓 And We have already created man and know what his soul whispers to him, and We are closer to him than [his] jugular vein.",
    "2:186 🔓 And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me [by obedience] and believe in Me that they may be [rightly] guided.",
    "57:4 🔓 It is He who created the heavens and earth in six days and then established Himself above the Throne. He knows what penetrates into the earth and what emerges from it and what descends from the heaven and what ascends therein; and He is with you wherever you are. And Allah, of what you do, is Seeing.", 
    "20:46 🔓 [Allah] said, 'Fear not. Indeed, I am with you both; I hear and I see.'",
    "4:81 🔓 And they say, '[We pledge] obedience.' But when they leave you, a group of them spend the night determining to do other than what you say. But Allah records what they plan by night. So turn away from them and rely upon Allah. And sufficient is Allah as Disposer of affairs.",
    "19:96 🔓 Indeed, those who have believed and done righteous deeds - the Most Merciful will appoint for them affection.",
    "33:41-42 🔓 O you who have believed, remember Allah with much remembrance. And exalt Him morning and afternoon.",
    "2:45 🔓 And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah].",
    "65:3 🔓 And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
    "11:123 🔓 And to Allah belongs the unseen [aspects] of the heavens and the earth, and to Him will be returned the matter, all of it, so worship Him and rely upon Him. And your Lord is not unaware of what you do.",
    "10:25 🔓 And Allah invites to the Home of Peace and guides whom He wills to a straight path.",
    "29:69 🔓 And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    "13:28 🔓 Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
    "2:257 🔓 Allah is the ally of those who believe. He brings them out from darknesses into the light. But those who disbelieve - their allies are Taghut. They take them out of the light into darknesses. Those are the companions of the Fire; they will abide eternally therein.",
    "58:7 🔓 Have you not considered that Allah knows what is in the heavens and what is on the earth? There is in no private conversation three but that He is the fourth of them, nor are there five but that He is the sixth of them - and no less than that and no more except that He is with them [in knowledge] wherever they are. Then He will inform them of what they did, on the Day of Resurrection. Indeed Allah is, of all things, Knowing.",
    "24:35 🔓 Allah is the light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a brilliant star lit from [the oil of] a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allah guides to His light whom He wills. And Allah presents examples for the people, and Allah is Knowing of all things.",
    "94:1-4 🔓 Did We not expand for you, [O Muhammad], your breast? And We removed from you your burden Which had weighed upon your back And raised high for you your repute?",
    "23:60 🔓 And they who give what they give while their hearts are fearful because they will be returning to their Lord -",
    "2:153 🔓 O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    "4:108 🔓 They hide themselves from the people, but they cannot hide themselves from Allah, and He is with them when they spend the night in such as He does not accept of speech. And ever is Allah, of what they do, encompassing.",
    "4:147 🔓 What would Allah do with your punishment if you are grateful and believe? And ever is Allah Appreciative and Knowing.", 
    "2:62 🔓 Indeed, those who believed and those who were Jews or Christians or Sabeans [before Prophet Muhammad] - those [among them] who believed in Allah and the Last Day and did righteousness - will have their reward with their Lord, and no fear will there be concerning them, nor will they grieve.", 
    "94:7-8 🔓 So when you have finished [your duties], then stand up [for worship]. And to your Lord direct [your] longing." 
]

# ❤️ Angry Jar - Verses for controlling anger and finding peace
Eng_angry_verses = [
    "42:40 🔓 The recompense for an evil is an evil like thereof; but whoever forgives and makes reconciliation, his reward is with Allah. Indeed, He does not like wrongdoers.",
    "42:37 🔓 And those who avoid the major sins and immoralities, and when they are angry, they forgive.",
    "3:134 🔓 Who spend [in the cause of Allah] during ease and hardship and who restrain their anger and who pardon the people - and Allah loves the doers of good.",
    "7:199 🔓 Take what is given freely, enjoin what is good, and turn away from the ignorant.",
    "41:34 🔓 And not equal are the good deed and the bad. Repel [evil] by that [deed] which is better; then the one whom between you and him is enmity [will become] as though he was a devoted friend.",
    "42:43 🔓 And whoever is patient and forgives - indeed, that is of the matters [requiring] determination.",
    "25:63 🔓 And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them [harshly], they say [words of] peace.",
    "28:55 🔓 And when they hear ill speech, they turn away from it and say, 'For us are our deeds, and for you are your deeds. Peace will be upon you; we seek not the ignorant.'",
    "65:3 🔓 And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
    "16:127 🔓 And be patient, [O Muhammad], and your patience is not but through Allah. And do not grieve over them and do not be in distress over what they conspire.",
    "70:5 🔓 So be patient with gracious patience.",
    "74:7 🔓 And for your Lord be patient.",
    "29:69 🔓 And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    "2:45 🔓 And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah].",
    "2:155-156 🔓 And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient, Who, when disaster strikes them, say, 'Indeed we belong to Allah, and indeed to Him we will return.'",
    "94:5-6 🔓 For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    "16:126 🔓 And if you punish [an enemy, O believers], punish with an equivalent of that with which you were harmed. But if you are patient - it is better for those who are patient.",
    "39:10 🔓 Say, 'O My servants who have believed, fear your Lord. For those who do good in this world is good, and the earth of Allah is spacious. Indeed, the patient will be given their reward without account.'",
    "5:13 🔓 So for their breaking of the covenant We cursed them and made their hearts hard. They distort words from their [proper] usages and have forgotten a portion of that of which they were reminded. And you will still observe deceit among them, except a few of them. But pardon them and overlook [their misdeeds]. Indeed, Allah loves the doers of good.",
    "24:22 🔓 And let not those of virtue among you and wealth swear not to give [aid] to their relatives and the needy and the emigrants for the cause of Allah, and let them pardon and overlook. Would you not like that Allah should forgive you? And Allah is Forgiving and Merciful.",
    "45:14 🔓 Say to those who have believed that they [should] forgive those who expect not the days of Allah so that He may recompense a people for what they used to earn.",
    "64:14 🔓 O you who have believed, indeed, among your wives and your children are enemies to you, so beware of them. But if you pardon and overlook and forgive - then indeed, Allah is Forgiving and Merciful.",
    "15:85 🔓 And We did not create the heavens and earth and that between them except in truth. And indeed, the Hour is coming; so forgive with gracious forgiveness.",
    "3:159 🔓 So by mercy from Allah, [O Muhammad], you were lenient with them. And if you had been rude [in speech] and harsh in heart, they would have disbanded from about you. So pardon them and ask forgiveness for them and consult them in the matter. And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely [upon Him].", 
    "17:53 🔓 And tell My servants to say that which is best. Indeed, Satan induces [dissension] among them. Indeed Satan is ever, to mankind, a clear enemy."
]

# 🩶 Sad Jar - Verses for comfort during grief and sorrow
Eng_sad_verses = [
    "2:155-156 🔓 And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient, Who, when disaster strikes them, say, 'Indeed we belong to Allah, and indeed to Him we will return.'",
    "94:5-6 🔓 For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    "2:286 🔓 Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. 'Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.'",
    "65:3 🔓 And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
    "64:11 🔓 No disaster strikes except by permission of Allah. And whoever believes in Allah - He will guide his heart. And Allah is Knowing of all things.",
    "21:35 🔓 Every soul will taste death. And We test you with evil and with good as trial; and to Us you will be returned.",
    "3:139 🔓 So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    "2:186 🔓 And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me [by obedience] and believe in Me that they may be [rightly] guided.",
    "13:28 🔓 Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
    "50:16 🔓 And We have already created man and know what his soul whispers to him, and We are closer to him than [his] jugular vein.",
    "42:28 🔓 And it is He who sends down the rain after [people] have despaired and spreads His mercy. And He is the Protector, the Praiseworthy.",
    "39:53 🔓 Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
    "16:97 🔓 Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life, and We will surely give them their reward [in the Hereafter] according to the best of what they used to do.",
    "10:25 🔓 And Allah invites to the Home of Peace and guides whom He wills to a straight path.",
    "18:88 🔓 But as for one who believes and does righteousness, he will have a goodly reward, and we will speak to him from our command with ease.",
    "29:69 🔓 And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    "8:46 🔓 And obey Allah and His Messenger, and do not dispute and [thus] lose courage and [then] your strength would depart; and be patient. Indeed, Allah is with the patient.",
    "3:146 🔓 And how many a prophet [fought and] with him fought many religious scholars. But they never lost assurance due to what afflicted them in the cause of Allah, nor did they weaken or submit. And Allah loves the steadfast.",
    "12:87 🔓 O my sons, go and find out about Joseph and his brother and despair not of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.",
    "30:50 🔓 So observe the effects of the mercy of Allah - how He gives life to the earth after its lifelessness. Indeed, that [same one] will give life to the dead, and He is over all things competent.",
    "11:88 🔓 He said, 'I only intend reform as much as I am able. And my success is not but through Allah. Upon him I have relied, and to Him I return.'",
    "12:18 🔓 And they brought upon his shirt false blood. [Jacob] said, 'Rather, your souls have enticed you to something, so patience is most fitting. And Allah is the one sought for help against that which you describe.'",
    "90:4 🔓 We have certainly created man into hardship.",
    "46:35 🔓 So be patient, [O Muhammad], as were those of determination among the messengers and do not be impatient for them. It will be - on the Day they see that which they are promised - as though they had not remained [in the world] except an hour of a day. [This is] notification. And will [any] be destroyed except the defiantly disobedient people?",
    "2:214 🔓 Or do you think that you will enter Paradise while such [trial] has not yet come to you as came to those who passed on before you? They were touched by poverty and hardship and were shaken until [even their] messenger and those who believed with him said, 'When is the help of Allah?' Unquestionably, the help of Allah is near.", # Comment: Added new verse about trials and hope
    "93:3-4 🔓 Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you]. And the hereafter is better for you than the first [life].", 
    "25:74 🔓 And those who say, 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.'" 
]

# 🖤 Tendency to Haram Jar - Verses for seeking forgiveness and avoiding sin
Eng_haram_tendency_verses = [
    "39:53 📜 Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
    "4:110 📜 And whoever does a wrong or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful.",
    "42:25 📜 And it is He who accepts repentance from his servants and pardons misdeeds, and He knows what you do.",
    "5:39 📜 But whoever repents after his wrongdoing and reforms, indeed, Allah will turn to him in forgiveness. Indeed, Allah is Forgiving and Merciful.",
    "3:135 📜 And those who, when they commit an immorality or wrong themselves [by transgression], remember Allah and seek forgiveness for their sins - and who can forgive sins except Allah? - and [who] do not persist in what they have done while they know.",
    "65:2-3 📜 And when they have [nearly] fulfilled their term, either retain them according to acceptable terms or part with them according to acceptable terms. And bring to witness two just men from among you and establish the testimony for [the acceptance of] Allah. That is instructed to whoever should believe in Allah and the Last Day. And whoever fears Allah - He will make for him a way out. And will provide for him from where he does not expect.", 
    "33:70-71 📜 O you who have believed, fear Allah and speak words of appropriate justice. He will [then] amend for you your deeds and forgive you your sins. And whoever obeys Allah and His Messenger has certainly attained a great attainment.",
    "65:3 📜 And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
    "2:199 📜 Then depart from the place from where [all] the people depart and ask forgiveness of Allah. Indeed, Allah is Forgiving and Merciful.", 
    "24:31 📜 And turn to Allah in repentance, all of you, O believers, that you might succeed.",
    "4:28 📜 And Allah wants to lighten for you [your difficulties]; and mankind was created weak.",
    "2:286 📜 Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. 'Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.'",
    "16:97 📜 Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life, and We will surely give them their reward [in the Hereafter] according to the best of what they used to do.",
    "29:69 📜 And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    "3:102 📜 O you who have believed, fear Allah as He should be feared and do not die except as Muslims [in submission to Him].",
    "3:103 📜 And hold firmly to the rope of Allah all together and do not become divided. And remember the favor of Allah upon you - when you were enemies and He brought your hearts together and you became, by His favor, brothers. And you were on the edge of a pit of the Fire, and He saved you from it. Thus does Allah make clear to you His verses that you may be guided.", 
    "49:13 📜 O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.", 
    "13:11 📜 For each one are successive [angels] before and behind him who protect him by the decree of Allah. Indeed, Allah will not change the condition of a people until they change what is in themselves. And when Allah intends for a people ill, there is no repelling it. And there is not for them besides Him any patron.", 
    "2:45 📜 And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah].",
    "66:8 📜 O you who have believed, repent to Allah with sincere repentance. Perhaps your Lord will remove from you your misdeeds and admit you into gardens beneath which rivers flow [on] the Day when Allah will not disgrace the Prophet and those who believed with him. Their light will proceed before them and on their right; they will say, 'Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.'", 
    "25:70 📜 Except for those who repent, believe and do righteous work. For them Allah will replace their evil deeds with good. And ever is Allah Forgiving and Merciful.",
    "7:156 📜 And decree for us in this world [that which is] good and [also] in the Hereafter; indeed, we have turned back to You.' [Allah] said, 'My punishment - I afflict with it whom I will, but My mercy encompasses all things. So I will decree it [especially] for those who fear Me and give zakah and those who believe in Our verses.'", 
    "17:25 📜 Your Lord is most knowing of what is within yourselves. If you should be righteous [in intention] - then indeed He is ever, to the oft-returning [to Him], Forgiving.", 
    "6:54 📜 And when those come to you who believe in Our verses, say, 'Peace be upon you. Your Lord has decreed upon Himself mercy: that any of you who does wrong out of ignorance and then repents after that and corrects himself - indeed, He is Forgiving and Merciful.'" 
]


#Eng
def qr_base(request):
    return render(request, 'Qr_base.html')


def english(request):
    return render(request, 'La_English.html')

def Eng_anxious(request):
    verse = random.choice(Eng_anxious_verses)
    return render(request, 'anxious.html', {'verse': verse})

def Eng_happy(request):
    verse = random.choice(Eng_happy_verses)
    return render(request, 'happy.html', {'verse': verse})

def Eng_thankful(request):
    verse = random.choice(Eng_thankful_verses)
    return render(request, 'thankful.html', {'verse': verse})

def Eng_lonely(request):
    verse = random.choice(Eng_lonely_verses)
    return render(request, 'lonely.html', {'verse': verse})

def Eng_angry(request):
    verse = random.choice(Eng_angry_verses)
    return render(request, 'angry.html', {'verse': verse})

def Eng_sad(request):
    verse = random.choice(Eng_sad_verses)
    return render(request, 'sad.html', {'verse': verse})

def Eng_haram_tendency(request):
    verse = random.choice(Eng_haram_tendency_verses)
    return render(request, 'haram_tendency.html', {'verse': verse})


# ML
Ml_anxious_verses = [
    "3:54 അവർ തന്ത്രം പ്രയോഗിച്ചു. അല്ലാഹുവും തന്ത്രം പ്രയോഗിച്ചു. അല്ലാഹുവാണ് ഏറ്റവും നല്ല തന്ത്രജ്ഞൻ.",
    "8:30 സത്യനിഷേധികളായ ആളുകൾ നിന്നെ ബന്ധനസ്ഥനാക്കാനോ കൊല്ലാനോ നിന്നെ പുറത്താക്കാനോ വേണ്ടി നിനക്കെതിരെ തന്ത്രം പ്രയോഗിച്ചിരുന്ന സന്ദർഭം (ഓർക്കുക). അവർ തന്ത്രം പ്രയോഗിക്കുകയും അല്ലാഹുവും തന്ത്രം പ്രയോഗിക്കുകയും ചെയ്തു. അല്ലാഹുവാണ് ഏറ്റവും നല്ല തന്ത്രജ്ഞൻ.",
    "13:28 വിശ്വസിക്കുകയും അല്ലാഹുവിൻ്റെ സ്മരണയാൽ മനസ്സുകൾക്ക് സമാധാനം ലഭിക്കുകയും ചെയ്യുന്നവർ. ശ്രദ്ധിക്കുക, അല്ലാഹുവിൻ്റെ സ്മരണയിലൂടെയാണ് മനസ്സുകൾക്ക് സമാധാനം ലഭിക്കുന്നത്.",
    "2:45 ക്ഷമയും നമസ്കാരവും മുഖേന നിങ്ങൾ സഹായം തേടുക. തീർച്ചയായും അത് ഭയഭക്തിയുള്ളവർക്കല്ലാതെ വലിയ ഭാരം തന്നെയാണ്.",
    "94:5-6 🔓 എന്നാൽ തീർച്ചയായും ഞെരുക്കത്തോടൊപ്പം എളുപ്പമുണ്ട്. (5) തീർച്ചയായും ഞെരുക്കത്തോടൊപ്പം എളുപ്പമുണ്ട്. (6)",
    "2:286 അല്ലാഹു ഒരാത്മാവിനും അതിൻ്റെ കഴിവിലുപരിയായി ഭാരം ചുമത്തുന്നില്ല. അത് ചെയ്ത നന്മ അതിനുതന്നെ; അത് ചെയ്ത തിന്മ അതിനുതന്നെ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾ മറന്നുപോവുകയോ തെറ്റിപ്പോവുകയോ ചെയ്തെങ്കിൽ ഞങ്ങളെ നീ ശിക്ഷിക്കരുതേ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്കുമുമ്പുള്ളവരുടെമേൽ നീ ചുമത്തിയതുപോലെ ഞങ്ങളുടെമേൽ നീ ഭാരം ചുമത്തരുതേ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്കു താങ്ങാൻ കഴിയാത്തത് ഞങ്ങളുടെമേൽ നീ ചുമത്തരുതേ. ഞങ്ങൾക്ക് നീ മാപ്പു നൽകുകയും ഞങ്ങൾക്ക് നീ പൊറുത്തുതരികയും ഞങ്ങളോട് നീ കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി. അതിനാൽ സത്യനിഷേധികളായ ജനങ്ങൾക്കെതിരെ ഞങ്ങൾക്ക് നീ സഹായം നൽകേണമേ.",
    "64:11 അല്ലാഹുവിൻ്റെ അനുമതിയില്ലാതെ യാതൊരു ആപത്തും സംഭവിക്കുന്നില്ല. ആരെങ്കിലും അല്ലാഹുവിൽ വിശ്വസിക്കുന്ന പക്ഷം അവൻ്റെ ഹൃദയത്തെ അവൻ നേർമാർഗ്ഗത്തിലാക്കും. അല്ലാഹു എല്ലാ കാര്യങ്ങളെക്കുറിച്ചും അറിവുള്ളവനാണ്.",
    "65:3 അവൻ കണക്കാക്കാത്ത വഴിക്ക് അവന് ഉപജീവനം നൽകുകയും ചെയ്യും. ആരെങ്കിലും അല്ലാഹുവിൽ ഭരമേൽപിക്കുന്ന പക്ഷം അവന് അല്ലാഹു മതിയാകും. തീർച്ചയായും അല്ലാഹു തൻ്റെ കാര്യം പൂർത്തിയാക്കുന്നവനാണ്. തീർച്ചയായും അല്ലാഹു ഓരോ കാര്യത്തിനും ഒരു നിശ്ചിത കണക്ക് ഏർപ്പെടുത്തിയിട്ടുണ്ട്.",
    "20:46 അവൻ പറഞ്ഞു: നിങ്ങൾ ഭയപ്പെടേണ്ട, തീർച്ചയായും ഞാൻ നിങ്ങളുടെ കൂടെയുണ്ട്, ഞാൻ കേൾക്കുകയും കാണുകയും ചെയ്യുന്നു.",
    "3:173 ആളുകൾ അവരോട് 'നിങ്ങൾക്കെതിരെ ആളുകൾ ഒരുമിച്ചുകൂടിയിരിക്കുന്നു, അതിനാൽ അവരെ ഭയപ്പെടുക' എന്ന് പറഞ്ഞപ്പോൾ അവർക്ക് വിശ്വാസം വർദ്ധിക്കുകയും 'ഞങ്ങൾക്ക് അല്ലാഹു മതി, അവൻ എത്ര നല്ല ഭരമേൽപിക്കുന്നവനാണ്' എന്ന് പറയുകയും ചെയ്തവർ.",
    "9:40 നിങ്ങൾ അദ്ദേഹത്തെ സഹായിക്കുന്നില്ലെങ്കിൽ തീർച്ചയായും അല്ലാഹു അദ്ദേഹത്തെ സഹായിച്ചിട്ടുണ്ട്. സത്യനിഷേധികൾ അദ്ദേഹത്തെ പുറത്താക്കിയ സന്ദർഭം, അദ്ദേഹം രണ്ടുപേരിൽ ഒരാളായിരുന്നപ്പോൾ, അവർ ഇരുവരും ഗുഹയിലായിരുന്നപ്പോൾ അദ്ദേഹം തൻ്റെ കൂട്ടുകാരനോട് 'ദുഃഖിക്കരുത്, തീർച്ചയായും അല്ലാഹു നമ്മുടെ കൂടെയുണ്ട്' എന്ന് പറഞ്ഞപ്പോൾ (അല്ലാഹു അദ്ദേഹത്തെ സഹായിച്ചു). അപ്പോൾ അല്ലാഹു തൻ്റെ മനസ്സമാധാനം അദ്ദേഹത്തിന്മേൽ ഇറക്കുകയും നിങ്ങൾ കാണാത്ത സൈന്യങ്ങളെക്കൊണ്ട് അദ്ദേഹത്തെ ശക്തിപ്പെടുത്തുകയും സത്യനിഷേധികളുടെ വാക്കിനെ താഴ്ന്നതാക്കുകയും ചെയ്തു. അല്ലാഹുവിൻ്റെ വാക്കാണ് ഏറ്റവും ഉന്നതം. അല്ലാഹു പ്രതാപശാലിയും യുക്തിമാനുമാണ്.",
    "4:81 അവർ 'അനുസരണ' എന്ന് പറയും. എന്നിട്ട് നിൻ്റെ അടുക്കൽ നിന്ന് പുറത്തുപോയാൽ അവരിൽ ഒരു വിഭാഗം നീ പറഞ്ഞതിനെതിരെ രാത്രിയിൽ ഗൂഢാലോചന നടത്തും. അവർ ഗൂഢാലോചന നടത്തുന്നതെല്ലാം അല്ലാഹു രേഖപ്പെടുത്തുന്നുണ്ട്. അതിനാൽ അവരെ വിട്ടുകളയുക, അല്ലാഹുവിൽ ഭരമേൽപിക്കുക. ഭരമേൽപിക്കാൻ അല്ലാഹു മതി.",
    "9:51 പറയുക: അല്ലാഹു ഞങ്ങൾക്കുവേണ്ടി രേഖപ്പെടുത്തിയതല്ലാതെ ഞങ്ങൾക്കൊന്നും സംഭവിക്കില്ല. അവനാണ് ഞങ്ങളുടെ രക്ഷാധികാരി. അല്ലാഹുവിലാണ് സത്യവിശ്വാസികൾ ഭരമേൽപിക്കേണ്ടത്.",
    "50:16 തീർച്ചയായും നാം മനുഷ്യനെ സൃഷ്ടിച്ചിരിക്കുന്നു. അവൻ്റെ മനസ്സ് അവനോട് മന്ത്രിക്കുന്നതെന്തും നാം അറിയുന്നു. നാം അവനോട് ജീവനാഡിയേക്കാൾ അടുത്തവനാണ്.",
    "42:28 അവനാണ് മനുഷ്യർ നിരാശരായതിന് ശേഷം മഴ വർഷിപ്പിക്കുകയും തൻ്റെ കാരുണ്യം വ്യാപിപ്പിക്കുകയും ചെയ്യുന്നത്. അവനാണ് രക്ഷാധികാരിയും സ്തുത്യർഹനും.",
    "3:159 അല്ലാഹുവിൽ നിന്നുള്ള കാരുണ്യം നിമിത്തമാണ് നീ അവരോട് സൗമ്യത കാണിച്ചത്. നീ പരുഷസ്വഭാവിയും കഠിനഹൃദയനുമായിരുന്നെങ്കിൽ അവർ നിൻ്റെ ചുറ്റിൽ നിന്ന് പിരിഞ്ഞുപോകുമായിരുന്നു. അതിനാൽ നീ അവർക്ക് മാപ്പുനൽകുകയും അവർക്കുവേണ്ടി പാപമോചനം തേടുകയും കാര്യങ്ങളിൽ അവരുമായി കൂടിയാലോചിക്കുകയും ചെയ്യുക. നീ ഒരു കാര്യം ചെയ്യാൻ തീരുമാനിച്ചാൽ അല്ലാഹുവിൽ ഭരമേൽപിക്കുക. തീർച്ചയായും അല്ലാഹു ഭരമേൽപ്പിക്കുന്നവരെ ഇഷ്ടപ്പെടുന്നു.",
    "33:3 അല്ലാഹുവിൽ ഭരമേൽപിക്കുക. ഭരമേൽപിക്കാൻ അല്ലാഹു മതി.",
    "12:64 അദ്ദേഹം (യാക്കൂബ്) പറഞ്ഞു: നിങ്ങളുടെ സഹോദരൻ്റെ കാര്യത്തിൽ മുമ്പ് ഞാൻ നിങ്ങളെ വിശ്വസിച്ചതുപോലെ ഇദ്ദേഹത്തിൻ്റെ കാര്യത്തിലും ഞാൻ നിങ്ങളെ വിശ്വസിക്കുമോ? അല്ലാഹുവാണ് ഏറ്റവും നല്ല സംരക്ഷകൻ. അവൻ കരുണാനിധികളിൽ വെച്ച് ഏറ്റവും വലിയ കരുണാനിധിയാണ്.",
    "2:216 യുദ്ധം ചെയ്യുന്നത് നിങ്ങൾക്ക് നിർബന്ധമാക്കപ്പെട്ടിരിക്കുന്നു. അതാകട്ടെ നിങ്ങൾക്ക് വെറുപ്പുള്ള കാര്യമാണ്. ഒരുപക്ഷേ, നിങ്ങൾക്ക് ഇഷ്ടമില്ലാത്ത ഒരു കാര്യം നിങ്ങൾക്ക് നല്ലതായിരിക്കാം. നിങ്ങൾക്ക് ഇഷ്ടപ്പെട്ട ഒരു കാര്യം നിങ്ങൾക്ക് ദോഷകരവുമായിരിക്കാം. അല്ലാഹു അറിയുന്നു, നിങ്ങൾ അറിയുന്നില്ല.",
    "3:139 നിങ്ങൾ ദുർബലരാകരുത്, ദുഃഖിക്കുകയും ചെയ്യരുത്. നിങ്ങൾ സത്യവിശ്വാസികളാണെങ്കിൽ നിങ്ങൾ തന്നെയാണ് ഉന്നതർ.",
    "16:127 നീ ക്ഷമിക്കുക. നിൻ്റെ ക്ഷമ അല്ലാഹുവിനെക്കൊണ്ടു മാത്രമാണ്. അവരെപ്പറ്റി നീ ദുഃഖിക്കരുത്. അവർ തന്ത്രം പ്രയോഗിക്കുന്നതിൻ്റെ പേരിൽ നീ പ്രയാസത്തിലാകുകയും അരുത്.",
    "29:2-3 🔓 ആളുകൾ 'ഞങ്ങൾ വിശ്വസിച്ചു' എന്ന് പറയുന്നതുകൊണ്ട് മാത്രം പരീക്ഷിക്കപ്പെടാതെ വിട്ടുകളയപ്പെടുമെന്ന് അവർ വിചാരിച്ചുവോ? (2) അവർക്ക് മുമ്പുള്ളവരെ നാം പരീക്ഷിച്ചിട്ടുണ്ട്. അതിനാൽ സത്യം പറഞ്ഞവരെ അല്ലാഹു അറിയും, കളവു പറഞ്ഞവരെയും അവൻ അറിയും. (3)",
    "23:115 നാം നിങ്ങളെ വെറുതെ സൃഷ്ടിച്ചതാണെന്നും നിങ്ങൾ നമ്മുടെ അടുത്തേക്ക് മടക്കപ്പെടുകയില്ലെന്നും നിങ്ങൾ വിചാരിച്ചുവോ?",
    "67:2 അവനാണ് മരണത്തെയും ജീവിതത്തെയും സൃഷ്ടിച്ചത്. നിങ്ങളിൽ ആരാണ് ഏറ്റവും നന്നായി പ്രവർത്തിക്കുന്നത് എന്ന് പരീക്ഷിക്കാൻ വേണ്ടി. അവൻ പ്രതാപിയും ഏറെ പൊറുക്കുന്നവനുമാണ്.",
    "2:214 നിങ്ങൾക്കുമുമ്പുണ്ടായിരുന്നവർക്ക് സംഭവിച്ചതുപോലെ നിങ്ങൾക്കും വരാതെ നിങ്ങൾ സ്വർഗ്ഗത്തിൽ പ്രവേശിക്കാമെന്ന് നിങ്ങൾ വിചാരിച്ചുവോ? ദാരിദ്ര്യവും രോഗങ്ങളും അവരെ ബാധിക്കുകയും അവർ വിറക്കുകയും ചെയ്തിരുന്നു, അന്തിമമായി റസൂലും അദ്ദേഹത്തോടൊപ്പം വിശ്വസിച്ചവരും 'അല്ലാഹുവിൻ്റെ സഹായം എപ്പോഴാണ്?' എന്ന് ചോദിക്കുന്നതുവരെ. അറിയുക! തീർച്ചയായും അല്ലാഹുവിൻ്റെ സഹായം അടുത്താണ്.",
    "2:155-156 🔓 ഭയം, വിശപ്പ്, സ്വത്തുക്കൾ, ജീവൻ, വിളവുകൾ എന്നിവയിൽ ചിലത് നൽകി നാം നിങ്ങളെ തീർച്ചയായും പരീക്ഷിക്കും. ക്ഷമിക്കുന്നവർക്ക് നീ സന്തോഷവാർത്ത അറിയിക്കുക. (155) അവർക്ക് വല്ല ആപത്തും ബാധിച്ചാൽ 'തീർച്ചയായും ഞങ്ങൾ അല്ലാഹുവിൻ്റേതാണ്, തീർച്ചയായും ഞങ്ങൾ അവങ്കലേക്ക് മടങ്ങുന്നവരാണ്' എന്ന് പറയുന്നവരത്രേ അവർ. (156)",
    "2:153 സത്യവിശ്വാസികളേ, ക്ഷമയും നമസ്കാരവും മുഖേന നിങ്ങൾ സഹായം തേടുക. തീർച്ചയായും അല്ലാഹു ക്ഷമിക്കുന്നവരോടൊപ്പമാണ്.",
    "7:200 പിശാചിൽ നിന്ന് വല്ല ദുർബോധനയും നിനക്ക് നേരിടുകയാണെങ്കിൽ അല്ലാഹുവിൽ അഭയം തേടുക. തീർച്ചയായും അവൻ എല്ലാം കേൾക്കുന്നവനും അറിയുന്നവനുമാണ്.",
    "4:58 തീർച്ചയായും അല്ലാഹു നിങ്ങളോട് കൽപിക്കുന്നത് അമാനത്തുകൾ അവയുടെ ഉടമസ്ഥർക്ക് തിരികെ ഏൽപിക്കാനാണ്. ജനങ്ങൾക്കിടയിൽ നിങ്ങൾ വിധി കൽപ്പിക്കുകയാണെങ്കിൽ നീതിപൂർവ്വം വിധി കൽപ്പിക്കുക. തീർച്ചയായും അല്ലാഹു നിങ്ങൾക്ക് നൽകുന്ന ഉപദേശം എത്ര നല്ലതാണ്! തീർച്ചയായും അല്ലാഹു എല്ലാം കേൾക്കുന്നവനും കാണുന്നവനുമാണ്.",
    "17:110 പറയുക: 'അല്ലാഹു' എന്ന് വിളിക്കുകയോ 'റഹ്മാൻ' എന്ന് വിളിക്കുകയോ ചെയ്യുക. നിങ്ങൾ എങ്ങനെ വിളിച്ചാലും അവന് ഏറ്റവും നല്ല നാമങ്ങളുണ്ട്. നിൻ്റെ നമസ്കാരത്തിൽ നീ ഉറക്കെ പറയുകയും ചെയ്യരുത്, തീരെ പതിഞ്ഞ സ്വരത്തിലാക്കുകയും ചെയ്യരുത്. അതിനിടയിലുള്ള ഒരു വഴി തേടുക."
]


Ml_happy_verses = [
    "10:58 പറയുക: അല്ലാഹുവിൻ്റെ അനുഗ്രഹം കൊണ്ടും കാരുണ്യം കൊണ്ടുമാണത്. അതുകൊണ്ട് അവർ സന്തോഷിച്ചു കൊള്ളട്ടെ. അതാണ് അവർ സമ്പാദിച്ചു കൂട്ടികൊണ്ടിരിക്കുന്നതിനെക്കാൾ ഉത്തമമായിട്ടുള്ളത്.",
    "16:97 ഏതൊരു ആണോ പെണ്ണോ സത്യവിശ്വാസിയായിക്കൊണ്ട് സല്‍ക്കര്‍മ്മം പ്രവര്‍ത്തിക്കുന്ന പക്ഷം നല്ലൊരു ജീവിതം തീര്‍ച്ചയായും ആ വ്യക്തിക്ക് നാം നല്‍കുന്നതാണ്. അവര്‍ പ്രവര്‍ത്തിച്ച് കൊണ്ടിരുന്നതില്‍ ഏറ്റവും ഉത്തമമായതിന് അനുസൃതമായി അവര്‍ക്കുള്ള പ്രതിഫലം തീര്‍ച്ചയായും നാം അവര്‍ക്ക് നല്‍കുകയും ചെയ്യും.", 
    "16:78 അല്ലാഹു നിങ്ങളെ നിങ്ങളുടെ മാതാക്കളുടെ വയറ്റിൽ നിന്ന് പുറത്തു കൊണ്ടുവന്നു. നിങ്ങൾ യാതൊന്നും അറിയാത്തവരായിരുന്നല്ലോ. അവൻ നിങ്ങൾക്ക് കേൾവിയും കാഴ്ചകളും ഹൃദയങ്ങളും നൽകി. നിങ്ങൾ നന്ദി കാണിക്കാൻ വേണ്ടി.",
    "16:10-11 🔓 അവനാണ് ആകാശത്ത് നിന്ന് നിങ്ങൾക്ക് വെള്ളം ഇറക്കിത്തന്നവൻ. അതിൽ നിന്ന് നിങ്ങൾക്ക് കുടിക്കാനുണ്ട്. അതിൽ നിന്ന് (വളരുന്ന സസ്യങ്ങളിൽ നിന്ന്) നിങ്ങൾ കന്നുകാലികളെ മേയ്ക്കുകയും ചെയ്യുന്നു. (10) അതിനെക്കൊണ്ട് അവൻ നിങ്ങൾക്കായി കൃഷികളും ഒലീവുകളും ഈത്തപ്പനകളും മുന്തിരികളും എല്ലാതരം പഴങ്ങളും മുളപ്പിക്കുന്നു. ചിന്തിക്കുന്ന ജനങ്ങൾക്ക് തീർച്ചയായും അതിൽ ദൃഷ്ടാന്തമുണ്ട്. (11)",
    "16:80 അല്ലാഹു നിങ്ങളുടെ വീടുകളെ നിങ്ങൾക്ക് താമസസ്ഥലമാക്കിയിരിക്കുന്നു. കാലികളുടെ തോലുകളിൽ നിന്ന് നിങ്ങളുടെ യാത്രാവേളയിലും താമസവേളയിലും എളുപ്പത്തിൽ ഉപയോഗിക്കാവുന്ന കൂടാരങ്ങളും അവൻ നിങ്ങൾക്ക് ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. അവയുടെ കമ്പിളികളിൽ നിന്നും രോമങ്ങളിൽ നിന്നും ചാണികളിൽ നിന്നും ഒരു നിശ്ചിത കാലം വരെ ഉപയോഗിക്കാവുന്ന ഉപകരണങ്ങളും വിഭവങ്ങളും (അവൻ ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു).",
    "2:186 എൻ്റെ ദാസന്മാർ എന്നെപ്പറ്റി നിന്നോട് ചോദിച്ചാൽ, ഞാൻ അടുത്തുള്ളവനാണ് (എന്ന് പറയുക). എന്നോട് പ്രാർത്ഥിക്കുന്നവൻ്റെ പ്രാർത്ഥനയ്ക്ക് ഞാൻ ഉത്തരം നൽകുന്നു. അതിനാൽ അവർ എൻ്റെ വിളിക്ക് ഉത്തരം നൽകുകയും എന്നിൽ വിശ്വസിക്കുകയും ചെയ്യട്ടെ. അവർ നേർമാർഗ്ഗം പ്രാപിക്കാൻ വേണ്ടി.",
    "16:53 നിങ്ങൾക്ക് ലഭിക്കുന്ന ഏതൊരു അനുഗ്രഹവും അല്ലാഹുവിൽ നിന്നാണ്. പിന്നീട് നിങ്ങൾക്ക് വല്ല കഷ്ടപ്പാടും ബാധിക്കുമ്പോൾ അവങ്കലേക്ക് നിങ്ങൾ ഉച്ചത്തിൽ സഹായം തേടുന്നു.",
    "16:18 അല്ലാഹുവിൻ്റെ അനുഗ്രഹങ്ങൾ നിങ്ങൾ എണ്ണിത്തിട്ടപ്പെടുത്തുകയാണെങ്കിൽ അവയ്ക്ക് നിങ്ങൾക്കൊരു കണക്കെടുക്കാൻ കഴിയില്ല. തീർച്ചയായും അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "16:81 അല്ലാഹു താൻ സൃഷ്ടിച്ച വസ്തുക്കളിൽ നിന്ന് നിങ്ങൾക്ക് തണലുകൾ ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. പർവ്വതങ്ങളിൽ നിന്ന് നിങ്ങൾക്ക് അഭയകേന്ദ്രങ്ങളും ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. ചൂടിൽ നിന്ന് നിങ്ങളെ കാക്കുന്ന വസ്ത്രങ്ങളും, യുദ്ധത്തിൽ നിന്ന് നിങ്ങളെ കാക്കുന്ന വസ്ത്രങ്ങളും അവൻ നിങ്ങൾക്ക് ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. ഇപ്രകാരം അവൻ തൻ്റെ അനുഗ്രഹം നിങ്ങൾക്ക് പൂർത്തീകരിക്കുന്നു, നിങ്ങൾ മുസ്ലിങ്ങളാകാൻ വേണ്ടി.",
    "21:35 എല്ലാ ദേഹവും മരണത്തിൻ്റെ രുചി അറിയുന്നതാണ്. നന്മയും തിന്മയും നാം നിങ്ങളെ പരീക്ഷണത്തിനായി ഉപയോഗിക്കും. നമ്മുടെ അടുത്തേക്ക് നിങ്ങൾ മടക്കപ്പെടുകയും ചെയ്യും.",
    "2:25 വിശ്വസിക്കുകയും സൽക്കർമ്മങ്ങൾ പ്രവർത്തിക്കുകയും ചെയ്യുന്നവർക്ക് സന്തോഷവാർത്ത അറിയിക്കുക: അവർക്ക് താഴെ നദികളൊഴുകുന്ന പൂന്തോപ്പുകളുണ്ട്. അവർക്ക് അവിടെ നിന്ന് വല്ല പഴവും ആഹാരമായി നൽകുമ്പോൾ, ഇത് മുമ്പ് ഞങ്ങൾക്ക് നൽകിയതുതന്നെയാണല്ലോ എന്ന് അവർ പറയും. അവർക്ക് അത് സമാനമായ നിലയിൽ നൽകപ്പെടും. അവർക്ക് അവിടെ പരിശുദ്ധരായ ഇണകളുമുണ്ടാകും. അവർ അതിൽ നിത്യവാസികളായിരിക്കും.",
    "18:88 എന്നാൽ ആരെങ്കിലും വിശ്വസിക്കുകയും സൽക്കർമ്മം പ്രവർത്തിക്കുകയും ചെയ്യുന്ന പക്ഷം അവന് ഏറ്റവും നല്ല പ്രതിഫലം ലഭിക്കും. അവനോട് നാം നമ്മുടെ കൽപ്പനകളിൽ എളുപ്പമുള്ളത് പറയുകയും ചെയ്യും.",
    "10:25 അല്ലാഹു ശാന്തിയുടെ ഭവനത്തിലേക്ക് ക്ഷണിക്കുന്നു. താൻ ഉദ്ദേശിക്കുന്നവരെ അവൻ നേർമാർഗ്ഗത്തിലേക്ക് നയിക്കുന്നു.",
    "39:53 പറയുക: എൻ്റെ ദാസന്മാരേ, തങ്ങളുടെ ആത്മാക്കളോട് അതിക്രമം കാണിച്ചവരേ, അല്ലാഹുവിൻ്റെ കാരുണ്യത്തിൽ നിങ്ങൾ നിരാശരാകരുത്. തീർച്ചയായും അല്ലാഹു എല്ലാ പാപങ്ങളും പൊറുക്കുന്നവനാണ്. അവൻ തീർച്ചയായും ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "25:70 പശ്ചാത്തപിക്കുകയും വിശ്വസിക്കുകയും സൽക്കർമ്മം പ്രവർത്തിക്കുകയും ചെയ്തവരൊഴികെ. അങ്ങനെയുള്ളവരുടെ തിന്മകളെ അല്ലാഹു നന്മകളാക്കി മാറ്റും. അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "103:1-3 🔓 കാലം സാക്ഷി. (1) തീർച്ചയായും മനുഷ്യൻ നഷ്ടത്തിലാണ്. (2) വിശ്വസിക്കുകയും സൽക്കർമ്മങ്ങൾ പ്രവർത്തിക്കുകയും സത്യം കൊണ്ട് അന്യോന്യം ഉപദേശിക്കുകയും ക്ഷമ കൊണ്ട് അന്യോന്യം ഉപദേശിക്കുകയും ചെയ്തവരൊഴികെ. (3)",
    "4:69 ആരെങ്കിലും അല്ലാഹുവിനെയും റസൂലിനെയും അനുസരിക്കുന്ന പക്ഷം അവർ അല്ലാഹു അനുഗ്രഹം ചെയ്തവരോടൊപ്പമായിരിക്കും; അഥവാ പ്രവാചകന്മാർ, സത്യസന്ധന്മാർ, രക്തസാക്ഷികൾ, സജ്ജനങ്ങളെ എന്നിവരോടൊപ്പമായിരിക്കും. എത്ര നല്ല കൂട്ടുകാരാണവർ!",
    "9:21 അവരുടെ രക്ഷിതാവ് തന്നിൽ നിന്നുള്ള കാരുണ്യവും പ്രീതിയും, സ്ഥിരമായ സുഖമുള്ള സ്വർഗ്ഗത്തോപ്പുകളും അവർക്ക് സന്തോഷവാർത്ത അറിയിക്കുന്നു.",
    "13:29 വിശ്വസിക്കുകയും സൽക്കർമ്മങ്ങൾ പ്രവർത്തിക്കുകയും ചെയ്തവർക്ക് സന്തോഷമുണ്ട്. നല്ലൊരു മടക്കസ്ഥലവുമുണ്ട്.",
    "32:17 അവർ പ്രവർത്തിച്ചിരുന്നതിന് പ്രതിഫലമായി അവർക്ക് വേണ്ടി കൺകുളിർപ്പിക്കുന്ന എന്ത് (സന്തോഷങ്ങൾ) ആണ് മറച്ചുവെച്ചിരിക്കുന്നത് എന്ന് ഒരു ദേഹവും അറിയില്ല.",
    "36:55 തീർച്ചയായും സ്വർഗ്ഗക്കാർ അന്ന് സന്തോഷകരമായ വിനോദങ്ങളിൽ വ്യാപൃതരായിരിക്കും.",
    "43:70 നിങ്ങൾ സ്വർഗ്ഗത്തിൽ പ്രവേശിക്കുക, നിങ്ങളും നിങ്ങളുടെ ഇണകളും സന്തോഷിച്ചവരായിട്ട്.",
    "76:11 അപ്പോൾ അല്ലാഹു അവരെ ആ ദിവസത്തിൻ്റെ തിന്മയിൽ നിന്ന് കാത്തുരക്ഷിച്ചു. അവർക്ക് നവോന്മേഷവും സന്തോഷവും നൽകി.",
    "89:27-30 🔓 ഹേ, സമാധാനമടഞ്ഞ മനസ്സേ, (27) നിൻ്റെ രക്ഷിതാവിലേക്ക് സന്തോഷത്തോടെ, തൃപ്തിയോടെ മടങ്ങുക. (28) എൻ്റെ ദാസന്മാരിൽ നീ പ്രവേശിക്കുക. (29) എൻ്റെ സ്വർഗ്ഗത്തിൽ നീ പ്രവേശിക്കുകയും ചെയ്യുക. (30)",
    "48:4 അവനാണ് സത്യവിശ്വാസികളുടെ ഹൃദയങ്ങളിൽ ശാന്തത ഇറക്കിക്കൊടുത്തത്. അവരുടെ വിശ്വാസത്തോടൊപ്പം വിശ്വാസം വർദ്ധിപ്പിക്കുന്നതിന് വേണ്ടിയാണ് അത്. ആകാശഭൂമികളിലെ സൈന്യങ്ങൾ അല്ലാഹുവിൻ്റേതാണ്. അല്ലാഹു എല്ലാം അറിയുന്നവനും യുക്തിമാനുമാണ്.",
    "24:35 അല്ലാഹു ആകാശങ്ങളുടെയും ഭൂമിയുടെയും പ്രകാശമാണ്. അവൻ്റെ പ്രകാശത്തിൻ്റെ ഉദാഹരണം ഒരു വിളക്കുകാല് പോലെയാണ്. അതിൽ ഒരു വിളക്കുണ്ട്. വിളക്ക് ഒരു സ്ഫടികത്തിനുള്ളിലാണ്. സ്ഫടികം തിളക്കമുള്ള നക്ഷത്രം പോലെയാണ്. കിഴക്കനോ പടിഞ്ഞാറനോ അല്ലാത്ത ഒരു അനുഗൃഹീത ഒലീവ് വൃക്ഷത്തിൽ നിന്ന് അത് കത്തിക്കപ്പെടുന്നു. അതിൻ്റെ എണ്ണ തീ തട്ടാതെ തന്നെ പ്രകാശിക്കാൻ സാധ്യതയുണ്ട്. പ്രകാശത്തിനു മേൽ പ്രകാശം. അല്ലാഹു തൻ്റെ പ്രകാശത്തിലേക്ക് താൻ ഉദ്ദേശിക്കുന്നവരെ നയിക്കുന്നു. അല്ലാഹു ജനങ്ങൾക്ക് ഉപമകൾ വിവരിച്ചുകൊടുക്കുന്നു. അല്ലാഹു എല്ലാ കാര്യങ്ങളെക്കുറിച്ചും അറിയുന്നവനാണ്.",
    "55:60 നന്മക്ക് നന്മയല്ലാതെ മറ്റെന്താണ് പ്രതിഫലം?",
    "41:30 തീർച്ചയായും 'ഞങ്ങളുടെ രക്ഷിതാവ് അല്ലാഹുവാണ്' എന്ന് പറയുകയും പിന്നീട് നേർവഴിയിൽ നിലകൊള്ളുകയും ചെയ്തവരുടെ അടുക്കലേക്ക് മലക്കുകൾ ഇറങ്ങിവരും. നിങ്ങൾ ഭയപ്പെടരുത്, ദുഃഖിക്കുകയും ചെയ്യരുത്. നിങ്ങൾക്ക് വാഗ്ദാനം ചെയ്യപ്പെട്ട സ്വർഗ്ഗത്തെക്കുറിച്ച് സന്തോഷിച്ചുകൊള്ളുക."
]

Ml_thankful_verses = [
    "14:7 നിങ്ങളുടെ രക്ഷിതാവ് പ്രഖ്യാപിച്ച സന്ദർഭം (ശ്രദ്ധേയമാണ്): നിങ്ങൾ നന്ദി കാണിക്കുകയാണെങ്കിൽ തീർച്ചയായും ഞാൻ നിങ്ങൾക്ക് കൂടുതൽ നൽകും. നിങ്ങൾ നന്ദികേട് കാണിക്കുകയാണെങ്കിൽ തീർച്ചയായും എൻ്റെ ശിക്ഷ കഠിനമായിരിക്കും.",
    "16:78 അല്ലാഹു നിങ്ങളെ നിങ്ങളുടെ മാതാക്കളുടെ വയറ്റിൽ നിന്ന് പുറത്തു കൊണ്ടുവന്നു. നിങ്ങൾ യാതൊന്നും അറിയാത്തവരായിരുന്നല്ലോ. അവൻ നിങ്ങൾക്ക് കേൾവിയും കാഴ്ചകളും ഹൃദയങ്ങളും നൽകി. നിങ്ങൾ നന്ദി കാണിക്കാൻ വേണ്ടി.",
    "2:152 അതിനാൽ എന്നെ നിങ്ങൾ ഓർക്കുക, ഞാൻ നിങ്ങളെ ഓർക്കും. എനിക്ക് നിങ്ങൾ നന്ദി കാണിക്കുക, നന്ദികേട് കാണിക്കരുത്.",
    "2:172 സത്യവിശ്വാസികളേ, നാം നിങ്ങൾക്ക് നൽകിയ നല്ല വസ്തുക്കളിൽ നിന്ന് ഭക്ഷിച്ചുകൊള്ളുക. നിങ്ങൾ അല്ലാഹുവിനെ മാത്രമാണ് ആരാധിക്കുന്നതെങ്കിൽ അവന് നിങ്ങൾ നന്ദി കാണിക്കുക.",
    "27:40 വേദത്തിൽ നിന്നുള്ള അറിവുള്ള ആൾ പറഞ്ഞു: 'നിങ്ങളുടെ കണ്ണ് ഇമവെട്ടുന്നതിന് മുമ്പ് ഞാൻ അത് നിങ്ങൾക്ക് കൊണ്ടുവരാം.' അങ്ങനെ അത് തൻ്റെ അടുത്ത് സ്ഥിരപ്പെട്ട് കണ്ടപ്പോൾ അദ്ദേഹം പറഞ്ഞു: 'ഇത് എൻ്റെ രക്ഷിതാവിൻ്റെ അനുഗ്രഹത്തിൽ പെട്ടതാണ്. ഞാൻ നന്ദി കാണിക്കുമോ അതോ നന്ദികേട് കാണിക്കുമോ എന്ന് എന്നെ പരീക്ഷിക്കാൻ വേണ്ടിയാണിത്. ആരെങ്കിലും നന്ദി കാണിച്ചാൽ അവൻ സ്വന്തം നന്മക്ക് വേണ്ടിയാണ് നന്ദി കാണിക്കുന്നത്. ആരെങ്കിലും നന്ദികേട് കാണിച്ചാൽ എൻ്റെ രക്ഷിതാവ് തീർച്ചയായും ധന്യനും ഉദാരനുമാണ്.'",
    "31:12 തീർച്ചയായും നാം ലുഖ്മാന് വിജ്ഞാനം നൽകി, 'അല്ലാഹുവിന് നന്ദി കാണിക്കുക' എന്ന് (ഉപദേശിച്ചുകൊണ്ട്). ആരെങ്കിലും നന്ദി കാണിച്ചാൽ അവൻ സ്വന്തം നന്മക്ക് വേണ്ടിയാണ് നന്ദി കാണിക്കുന്നത്. ആരെങ്കിലും നന്ദികേട് കാണിച്ചാൽ തീർച്ചയായും അല്ലാഹു ധന്യനും സ്തുത്യർഹനുമാണ്.",
    "16:53 നിങ്ങൾക്ക് ലഭിക്കുന്ന ഏതൊരു അനുഗ്രഹവും അല്ലാഹുവിൽ നിന്നാണ്. പിന്നീട് നിങ്ങൾക്ക് വല്ല കഷ്ടപ്പാടും ബാധിക്കുമ്പോൾ അവങ്കലേക്ക് നിങ്ങൾ ഉച്ചത്തിൽ സഹായം തേടുന്നു.",
    "14:34 നിങ്ങൾ ചോദിച്ചതിലെല്ലാം അവൻ നിങ്ങൾക്ക് നൽകിയിരിക്കുന്നു. അല്ലാഹുവിൻ്റെ അനുഗ്രഹങ്ങൾ നിങ്ങൾ എണ്ണിത്തിട്ടപ്പെടുത്തുകയാണെങ്കിൽ അവയ്ക്ക് നിങ്ങൾക്കൊരു കണക്കെടുക്കാൻ കഴിയില്ല. തീർച്ചയായും മനുഷ്യൻ വലിയ അക്രമിയും നന്ദികെട്ടവനുമാണ്.",
    "34:13 അവർക്ക് വേണ്ടി അവൻ ഉദ്ദേശിക്കുന്നതെല്ലാം അവർ നിർമ്മിച്ചിരുന്നു - വലിയ ആരാധനാലയങ്ങൾ, പ്രതിമകൾ, ജലസംഭരണികളെപ്പോലുള്ള വലിയ പാത്രങ്ങൾ, ഉറപ്പിച്ചു നിർത്തിയ കലങ്ങൾ എന്നിവ. ദാവൂദിൻ്റെ കുടുംബമേ, നിങ്ങൾ നന്ദിപൂർവ്വം പ്രവർത്തിക്കുക. എൻ്റെ ദാസന്മാരിൽ നന്ദിയുള്ളവർ ചുരുക്കമാണ്.",
    "3:145 അല്ലാഹുവിൻ്റെ അനുമതിയില്ലാതെ ഒരു ദേഹത്തിനും മരിക്കാൻ കഴിയില്ല; അത് രേഖപ്പെടുത്തപ്പെട്ട ഒരു അവധിയാണ്. ഐഹിക ലോകത്തെ പ്രതിഫലം ഉദ്ദേശിക്കുന്നവർക്ക് നാം അതിൽ നിന്ന് നൽകും. പരലോകത്തെ പ്രതിഫലം ഉദ്ദേശിക്കുന്നവർക്ക് നാം അതിൽ നിന്ന് നൽകും. നന്ദി കാണിക്കുന്നവർക്ക് നാം പ്രതിഫലം നൽകും.",
    "16:81 അല്ലാഹു താൻ സൃഷ്ടിച്ച വസ്തുക്കളിൽ നിന്ന് നിങ്ങൾക്ക് തണലുകൾ ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. പർവ്വതങ്ങളിൽ നിന്ന് നിങ്ങൾക്ക് അഭയകേന്ദ്രങ്ങളും ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. ചൂടിൽ നിന്ന് നിങ്ങളെ കാക്കുന്ന വസ്ത്രങ്ങളും, യുദ്ധത്തിൽ നിന്ന് നിങ്ങളെ കാക്കുന്ന വസ്ത്രങ്ങളും അവൻ നിങ്ങൾക്ക് ഉണ്ടാക്കിത്തന്നിരിക്കുന്നു. ഇപ്രകാരം അവൻ തൻ്റെ അനുഗ്രഹം നിങ്ങൾക്ക് പൂർത്തീകരിക്കുന്നു, നിങ്ങൾ മുസ്ലിങ്ങളാകാൻ വേണ്ടി.",
    "27:73 തീർച്ചയായും നിൻ്റെ രക്ഷിതാവ് ജനങ്ങളോട് ഏറെ ദയ കാണിക്കുന്നവനാണ്. പക്ഷേ, അവരിൽ അധികപേരും നന്ദി കാണിക്കുന്നില്ല.",
    "55:13 അതിനാൽ നിങ്ങളുടെ രക്ഷിതാവിൻ്റെ അനുഗ്രഹങ്ങളിൽ ഏതിനെയാണ് നിങ്ങൾ ഇരുവരും കളവാക്കുന്നത്?",
    "17:3 നൂഹിനോടൊപ്പം നാം (കപ്പലിൽ) കയറ്റിയവരുടെ സന്തതികളേ! തീർച്ചയായും അദ്ദേഹം വളരെ നന്ദിയുള്ള ഒരു ദാസനായിരുന്നു.",
    "76:9 ഞങ്ങൾ നിങ്ങൾക്ക് ആഹാരം നൽകുന്നത് അല്ലാഹുവിൻ്റെ പ്രീതിക്ക് വേണ്ടി മാത്രമാണ്. നിങ്ങളിൽ നിന്ന് ഒരു പ്രതിഫലമോ നന്ദിയോ ഞങ്ങൾ ആഗ്രഹിക്കുന്നില്ല.",
    "2:243 മരണഭയം കാരണം ആയിരക്കണക്കിന് ആളുകൾ തങ്ങളുടെ വീടുകളിൽ നിന്ന് പുറത്തിറങ്ങിയവരെ നീ കണ്ടില്ലേ? അപ്പോൾ അല്ലാഹു അവരോട് 'മരിക്കുക' എന്ന് പറഞ്ഞു. പിന്നീട് അവരെ അവൻ ജീവിപ്പിച്ചു. തീർച്ചയായും അല്ലാഹു ജനങ്ങളോട് വലിയ അനുഗ്രഹം ചെയ്യുന്നവനാണ്. പക്ഷേ, ജനങ്ങളിൽ അധികപേരും നന്ദി കാണിക്കുന്നില്ല.",
    "8:26 നിങ്ങൾ ഭൂമിയിൽ ദുർബലരായി, എണ്ണം കുറഞ്ഞവരായി, ആളുകൾ നിങ്ങളെ പിടിച്ചുകൊണ്ടുപോകുമോ എന്ന് ഭയപ്പെട്ടിരുന്ന സന്ദർഭം ഓർക്കുക. അപ്പോൾ അവൻ നിങ്ങൾക്ക് അഭയം നൽകുകയും തൻ്റെ സഹായം കൊണ്ട് നിങ്ങളെ ശക്തിപ്പെടുത്തുകയും നല്ല വസ്തുക്കളിൽ നിന്ന് നിങ്ങൾക്ക് ആഹാരം നൽകുകയും ചെയ്തു, നിങ്ങൾ നന്ദി കാണിക്കാൻ വേണ്ടി.",
    "35:3 ജനങ്ങളേ, അല്ലാഹു നിങ്ങൾക്ക് നൽകിയ അനുഗ്രഹം ഓർക്കുക. അല്ലാഹുവല്ലാത്ത വല്ല സ്രഷ്ടാവുമുണ്ടോ, ആകാശത്തുനിന്നും ഭൂമിയിൽനിന്നും നിങ്ങൾക്ക് ഉപജീവനം നൽകുന്ന? അവനല്ലാതെ ആരാധനക്കർഹനില്ല. അപ്പോൾ നിങ്ങൾ എങ്ങനെയാണ് തെറ്റിപ്പോകുന്നത്?",
    "16:114 അല്ലാഹു നിങ്ങൾക്ക് നൽകിയ ആഹാരത്തിൽ നിന്ന് ഹലാലും നല്ലതുമായത് നിങ്ങൾ ഭക്ഷിക്കുക. നിങ്ങൾ അവനെ മാത്രമാണ് ആരാധിക്കുന്നതെങ്കിൽ അല്ലാഹുവിൻ്റെ അനുഗ്രഹത്തിന് നിങ്ങൾ നന്ദി കാണിക്കുക.",
    "29:17 അല്ലാഹുവിന് പുറമെ നിങ്ങൾ വിഗ്രഹങ്ങളെയാണ് ആരാധിക്കുന്നത്. നിങ്ങൾ കളവ് നിർമ്മിക്കുകയാണ്. അല്ലാഹുവിന് പുറമെ നിങ്ങൾ ആരാധിക്കുന്നവർക്ക് നിങ്ങൾക്ക് ഉപജീവനം നൽകാൻ കഴിയില്ല. അതിനാൽ അല്ലാഹുവിൻ്റെ അടുക്കൽ ഉപജീവനം തേടുക. അവനെ ആരാധിക്കുകയും അവന് നന്ദി കാണിക്കുകയും ചെയ്യുക. അവനിലേക്കാണ് നിങ്ങൾ മടങ്ങുന്നത്.",
    "7:10 തീർച്ചയായും നാം നിങ്ങൾക്ക് ഭൂമിയിൽ വാസസ്ഥലം ഒരുക്കിത്തന്നു. അതിൽ നിങ്ങൾക്ക് ജീവിതമാർഗ്ഗങ്ങളും നൽകി. നിങ്ങൾ എത്ര കുറഞ്ഞാണ് നന്ദി കാണിക്കുന്നത്!",
    "6:63 പറയുക: കരയിലെയും കടലിലെയും ഇരുട്ടുകളിൽ നിന്ന് നിങ്ങളെ രക്ഷിക്കുന്നവൻ ആരാണ്? നിങ്ങൾ അവനെ താഴ്മയോടും രഹസ്യമായും വിളിച്ചു പ്രാർത്ഥിക്കുന്നു: 'ഇതിൽ നിന്ന് ഞങ്ങളെ രക്ഷിക്കുകയാണെങ്കിൽ തീർച്ചയായും ഞങ്ങൾ നന്ദിയുള്ളവരിൽ പെടും.'",
    "14:5 തീർച്ചയായും നാം മൂസയെ നമ്മുടെ ദൃഷ്ടാന്തങ്ങളോടുകൂടി അയച്ചു, നിൻ്റെ ജനതയെ ഇരുട്ടുകളിൽ നിന്ന് വെളിച്ചത്തിലേക്ക് കൊണ്ടുവരിക എന്നും അല്ലാഹുവിൻ്റെ ദിവസങ്ങളെക്കുറിച്ച് അവരെ ഓർമ്മിപ്പിക്കുക എന്നും പറഞ്ഞുകൊണ്ട്. തീർച്ചയായും അതിൽ എല്ലാ ക്ഷമിക്കുന്നവർക്കും നന്ദിയുള്ളവർക്കും ദൃഷ്ടാന്തങ്ങളുണ്ട്.",
    "54:35 നമ്മുടെ അടുക്കൽ നിന്ന് (നൽകിയ) അനുഗ്രഹമായിട്ട്. നന്ദി കാണിക്കുന്നവർക്ക് നാം ഇപ്രകാരമാണ് പ്രതിഫലം നൽകുന്നത്.",
    "17:19 ആരെങ്കിലും പരലോകം ഉദ്ദേശിക്കുകയും അതിനുവേണ്ടി അതിൻ്റെ പരിശ്രമം ചെയ്യുകയും അവൻ സത്യവിശ്വാസിയായിരിക്കുകയും ചെയ്താൽ അങ്ങനെയുള്ളവരുടെ പരിശ്രമം നന്ദിപൂർവ്വം സ്വീകരിക്കപ്പെടും."
]


Ml_lonely_verses = [
    "50:16 തീർച്ചയായും നാം മനുഷ്യനെ സൃഷ്ടിച്ചിരിക്കുന്നു. അവൻ്റെ മനസ്സ് അവനോട് മന്ത്രിക്കുന്നതെന്തും നാം അറിയുന്നു. നാം അവനോട് ജീവനാഡിയേക്കാൾ അടുത്തവനാണ്.",
    "2:186 എൻ്റെ ദാസന്മാർ എന്നെപ്പറ്റി നിന്നോട് ചോദിച്ചാൽ, ഞാൻ അടുത്തുള്ളവനാണ് (എന്ന് പറയുക). എന്നോട് പ്രാർത്ഥിക്കുന്നവൻ്റെ പ്രാർത്ഥനയ്ക്ക് ഞാൻ ഉത്തരം നൽകുന്നു. അതിനാൽ അവർ എൻ്റെ വിളിക്ക് ഉത്തരം നൽകുകയും എന്നിൽ വിശ്വസിക്കുകയും ചെയ്യട്ടെ. അവർ നേർമാർഗ്ഗം പ്രാപിക്കാൻ വേണ്ടി.",
    "57:4 അവനാണ് ആകാശങ്ങളെയും ഭൂമിയെയും ആറു ദിവസങ്ങളിൽ സൃഷ്ടിച്ചത്. പിന്നീട് അവൻ സിംഹാസനസ്ഥനായി. ഭൂമിയിൽ പ്രവേശിക്കുന്നതും അതിൽ നിന്ന് പുറത്തുവരുന്നതും ആകാശത്ത് നിന്ന് ഇറങ്ങുന്നതും അതിലേക്ക് കയറിപ്പോകുന്നതും അവൻ അറിയുന്നു. നിങ്ങൾ എവിടെയായിരുന്നാലും അവൻ നിങ്ങളോടൊപ്പമുണ്ട്. നിങ്ങൾ പ്രവർത്തിക്കുന്നതെല്ലാം അല്ലാഹു കാണുന്നവനാണ്.",
    "20:46 അവൻ പറഞ്ഞു: നിങ്ങൾ ഭയപ്പെടേണ്ട, തീർച്ചയായും ഞാൻ നിങ്ങളുടെ കൂടെയുണ്ട്, ഞാൻ കേൾക്കുകയും കാണുകയും ചെയ്യുന്നു.",
    "4:81 അവർ 'അനുസരണ' എന്ന് പറയും. എന്നിട്ട് നിൻ്റെ അടുക്കൽ നിന്ന് പുറത്തുപോയാൽ അവരിൽ ഒരു വിഭാഗം നീ പറഞ്ഞതിനെതിരെ രാത്രിയിൽ ഗൂഢാലോചന നടത്തും. അവർ ഗൂഢാലോചന നടത്തുന്നതെല്ലാം അല്ലാഹു രേഖപ്പെടുത്തുന്നുണ്ട്. അതിനാൽ അവരെ വിട്ടുകളയുക, അല്ലാഹുവിൽ ഭരമേൽപിക്കുക. ഭരമേൽപിക്കാൻ അല്ലാഹു മതി.",
    "19:96 തീർച്ചയായും വിശ്വസിക്കുകയും സൽക്കർമ്മങ്ങൾ പ്രവർത്തിക്കുകയും ചെയ്തവർക്ക് കാരുണ്യവാൻ (അല്ലാഹു) സ്നേഹം ഉണ്ടാക്കും.",
    "33:41-42 🔓 സത്യവിശ്വാസികളേ, നിങ്ങൾ അല്ലാഹുവിനെ ധാരാളമായി ഓർക്കുക. (41) രാവിലെയും വൈകുന്നേരവും അവനെ സ്തുതിക്കുകയും ചെയ്യുക. (42)",
    "2:45 ക്ഷമയും നമസ്കാരവും മുഖേന നിങ്ങൾ സഹായം തേടുക. തീർച്ചയായും അത് ഭയഭക്തിയുള്ളവർക്കല്ലാതെ വലിയ ഭാരം തന്നെയാണ്.",
    "65:3 അവൻ കണക്കാക്കാത്ത വഴിക്ക് അവന് ഉപജീവനം നൽകുകയും ചെയ്യും. ആരെങ്കിലും അല്ലാഹുവിൽ ഭരമേൽപിക്കുന്ന പക്ഷം അവന് അല്ലാഹു മതിയാകും. തീർച്ചയായും അല്ലാഹു തൻ്റെ കാര്യം പൂർത്തിയാക്കുന്നവനാണ്. തീർച്ചയായും അല്ലാഹു ഓരോ കാര്യത്തിനും ഒരു നിശ്ചിത കണക്ക് ഏർപ്പെടുത്തിയിട്ടുണ്ട്.",
    "11:123 ആകാശങ്ങളുടെയും ഭൂമിയുടെയും അദൃശ്യം അല്ലാഹുവിനാണ്. കാര്യങ്ങളെല്ലാം അവങ്കലേക്ക് മടക്കപ്പെടുന്നു. അതിനാൽ അവനെ ആരാധിക്കുകയും അവനിൽ ഭരമേൽപിക്കുകയും ചെയ്യുക. നിങ്ങൾ പ്രവർത്തിക്കുന്നതിനെക്കുറിച്ച് നിൻ്റെ രക്ഷിതാവ് അശ്രദ്ധനല്ല.",
    "10:25 അല്ലാഹു ശാന്തിയുടെ ഭവനത്തിലേക്ക് ക്ഷണിക്കുന്നു. താൻ ഉദ്ദേശിക്കുന്നവരെ അവൻ നേർമാർഗ്ഗത്തിലേക്ക് നയിക്കുന്നു.",
    "29:69 ആരെങ്കിലും നമ്മുടെ മാർഗ്ഗത്തിൽ കഠിനാധ്വാനം ചെയ്യുന്ന പക്ഷം തീർച്ചയായും നമ്മുടെ വഴികളിലേക്ക് നാം അവരെ നയിക്കും. തീർച്ചയായും അല്ലാഹു സുകൃതം ചെയ്യുന്നവരോടൊപ്പമാണ്.",
    "13:28 വിശ്വസിക്കുകയും അല്ലാഹുവിൻ്റെ സ്മരണയാൽ മനസ്സുകൾക്ക് സമാധാനം ലഭിക്കുകയും ചെയ്യുന്നവർ. ശ്രദ്ധിക്കുക, അല്ലാഹുവിൻ്റെ സ്മരണയിലൂടെയാണ് മനസ്സുകൾക്ക് സമാധാനം ലഭിക്കുന്നത്.",
    "2:257 അല്ലാഹു സത്യവിശ്വാസികളുടെ രക്ഷാധികാരിയാണ്. അവൻ അവരെ ഇരുട്ടുകളിൽ നിന്ന് വെളിച്ചത്തിലേക്ക് കൊണ്ടുവരുന്നു. സത്യനിഷേധികളുടെ രക്ഷാധികാരികളാകട്ടെ താഗൂത്തുകളാണ്. അവർ അവരെ വെളിച്ചത്തിൽ നിന്ന് ഇരുട്ടുകളിലേക്ക് കൊണ്ടുവരുന്നു. അങ്ങനെയുള്ളവരാണ് നരകാവകാശികൾ. അവർ അതിൽ നിത്യവാസികളായിരിക്കും.",
    "58:7 നീ കണ്ടില്ലേ, ആകാശങ്ങളിലുള്ളതും ഭൂമിയിലുള്ളതും അല്ലാഹു അറിയുന്നുണ്ടെന്ന്? മൂന്നുപേർ രഹസ്യമായി സംസാരിക്കുകയാണെങ്കിൽ അവൻ അവരിൽ നാലാമനാണ്. അഞ്ചുപേരാണെങ്കിൽ അവൻ അവരിൽ ആറാമനാണ്. അതിനേക്കാൾ കുറഞ്ഞവരോ കൂടുതലുകളോ ആകട്ടെ, അവർ എവിടെയായിരുന്നാലും അവൻ അവരോടൊപ്പമുണ്ട്. പിന്നീട് ഉയിർത്തെഴുന്നേൽപിൻ്റെ നാളിൽ അവർ പ്രവർത്തിച്ചതിനെക്കുറിച്ച് അവൻ അവരെ അറിയിക്കും. തീർച്ചയായും അല്ലാഹു എല്ലാ കാര്യങ്ങളെക്കുറിച്ചും അറിയുന്നവനാണ്.",
    "24:35 അല്ലാഹു ആകാശങ്ങളുടെയും ഭൂമിയുടെയും പ്രകാശമാണ്. അവൻ്റെ പ്രകാശത്തിൻ്റെ ഉദാഹരണം ഒരു വിളക്കുകാല് പോലെയാണ്. അതിൽ ഒരു വിളക്കുണ്ട്. വിളക്ക് ഒരു സ്ഫടികത്തിനുള്ളിലാണ്. സ്ഫടികം തിളക്കമുള്ള നക്ഷത്രം പോലെയാണ്. കിഴക്കനോ പടിഞ്ഞാറനോ അല്ലാത്ത ഒരു അനുഗൃഹീത ഒലീവ് വൃക്ഷത്തിൽ നിന്ന് അത് കത്തിക്കപ്പെടുന്നു. അതിൻ്റെ എണ്ണ തീ തട്ടാതെ തന്നെ പ്രകാശിക്കാൻ സാധ്യതയുണ്ട്. പ്രകാശത്തിനു മേൽ പ്രകാശം. അല്ലാഹു തൻ്റെ പ്രകാശത്തിലേക്ക് താൻ ഉദ്ദേശിക്കുന്നവരെ നയിക്കുന്നു. അല്ലാഹു ജനങ്ങൾക്ക് ഉപമകൾ വിവരിച്ചുകൊടുക്കുന്നു. അല്ലാഹു എല്ലാ കാര്യങ്ങളെക്കുറിച്ചും അറിയുന്നവനാണ്.",
    "94:1-4 🔓 നിനക്ക് നാം നിൻ്റെ ഹൃദയം വിശാലമാക്കിക്കൊടുത്തില്ലേ? (1) നിൻ്റെ ഭാരം നാം ഇറക്കിവെച്ചില്ലേ? (2) നിൻ്റെ മുതുകിനെ ഞെരിച്ച ഭാരം. (3) നിൻ്റെ കീർത്തിയെ നാം ഉയർത്തിക്കൊടുക്കുകയും ചെയ്തിരിക്കുന്നു. (4)",
    "23:60 തങ്ങൾ നൽകേണ്ടത് നൽകുകയും തങ്ങളുടെ രക്ഷിതാവിലേക്ക് മടങ്ങുന്നവരാണല്ലോ എന്ന് തങ്ങളുടെ മനസ്സുകൾ ഭയപ്പെട്ടവരുമായ ആളുകൾ.",
    "2:153 സത്യവിശ്വാസികളേ, ക്ഷമയും നമസ്കാരവും മുഖേന നിങ്ങൾ സഹായം തേടുക. തീർച്ചയായും അല്ലാഹു ക്ഷമിക്കുന്നവരോടൊപ്പമാണ്.",
    "4:108 അവർ ജനങ്ങളിൽ നിന്ന് ഒളിച്ചുവയ്ക്കുന്നു. എന്നാൽ അല്ലാഹുവിൽ നിന്ന് ഒളിച്ചുവയ്ക്കുന്നില്ല, അവർക്ക് ഇഷ്ടമില്ലാത്ത സംസാരം അവർ രാത്രിയിൽ ഗൂഢാലോചന നടത്തുമ്പോൾ അവൻ അവരോടൊപ്പമാണ്. അല്ലാഹു അവർ പ്രവർത്തിക്കുന്നതെല്ലാം വലയം ചെയ്യുന്നവനാണ്.",
    "4:147 നിങ്ങൾ നന്ദി കാണിക്കുകയും വിശ്വസിക്കുകയും ചെയ്താൽ നിങ്ങളുടെ ശിക്ഷ കൊണ്ട് അല്ലാഹു എന്തു ചെയ്യാനാണ്? അല്ലാഹു നന്ദി സ്വീകരിക്കുന്നവനും എല്ലാം അറിയുന്നവനുമാണ്.",
    "2:62 തീർച്ചയായും വിശ്വസിച്ചവരും ജൂതരും ക്രിസ്ത്യാനികളും സാബികളും - അവരിൽ ആരെങ്കിലും അല്ലാഹുവിലും അന്ത്യദിനത്തിലും വിശ്വസിക്കുകയും സൽക്കർമ്മം പ്രവർത്തിക്കുകയും ചെയ്താൽ അവർക്ക് അവരുടെ പ്രതിഫലം അവരുടെ രക്ഷിതാവിൻ്റെ അടുക്കലുണ്ടാകും. അവർക്ക് യാതൊരു ഭയവുമില്ല, അവർ ദുഃഖിക്കുകയും ഇല്ല.",
    "94:7-8 🔓 അതിനാൽ നീ ഒഴിവായിക്കഴിഞ്ഞാൽ (മറ്റൊന്നിനായി) അധ്വാനിക്കുക. (7) നിൻ്റെ രക്ഷിതാവിങ്കലേക്ക് മാത്രം താൽപര്യത്തോടെ തിരിയുക. (8)"
]

Ml_angry_verses = [
    "42:40 ഒരു തിന്മയുടെ പ്രതിഫലം അതിന് സമാനമായ തിന്മയാണ്. ആരെങ്കിലും മാപ്പുനൽകുകയും രഞ്ജിപ്പുണ്ടാക്കുകയും ചെയ്താൽ അവൻ്റെ പ്രതിഫലം അല്ലാഹുവിൻ്റെ ചുമതലയിലാണ്. തീർച്ചയായും അവൻ അതിക്രമികളെ ഇഷ്ടപ്പെടുന്നില്ല.",
    "42:37 വൻപാപങ്ങളും നീചവൃത്തികളും വെടിഞ്ഞുനിൽക്കുന്നവരും കോപം വരുമ്പോൾ പൊറുത്തുകൊടുക്കുന്നവരുമായ ആളുകൾ.",
    "3:134 സന്തോഷത്തിലും ദുരിതത്തിലും (ധനം) ചിലവഴിക്കുന്നവരും കോപം അടക്കിവെക്കുന്നവരും ജനങ്ങൾക്ക് മാപ്പുനൽകുന്നവരുമായ ആളുകൾ. അല്ലാഹു സുകൃതം ചെയ്യുന്നവരെ ഇഷ്ടപ്പെടുന്നു.",
    "7:199 വിട്ടുവീഴ്ച സ്വീകരിക്കുക. സദാചാരം കൽപ്പിക്കുക. വിവരദോഷികളിൽ നിന്ന് തിരിഞ്ഞുകളയുക.",
    "41:34 നന്മയും തിന്മയും ഒരുപോലെയാകുകയില്ല. ഏറ്റവും നല്ലത് കൊണ്ട് പ്രതിരോധിക്കുക. അപ്പോൾ നിന്നോടും അവനോടും ശത്രുതയിലായിരുന്നവൻ ഉറ്റബന്ധുവിനെപ്പോലെയായിത്തീരും.",
    "42:43 ആരെങ്കിലും ക്ഷമിക്കുകയും പൊറുത്തുകൊടുക്കുകയും ചെയ്താൽ തീർച്ചയായും അത് ദൃഢമായ കാര്യങ്ങളിൽ പെട്ടതാകുന്നു.",
    "25:63 കാരുണ്യവാന്റെ ദാസന്മാർ ഭൂമിയിലൂടെ വിനയത്തോടെ നടക്കുന്നവരും വിവരമില്ലാത്തവർ അവരോട് സംസാരിച്ചാൽ 'സലാം' എന്ന് പറയുന്നവരുമാണ്.",
    "28:55 അവർ അനാവശ്യം കേൾക്കുമ്പോൾ അതിൽ നിന്ന് തിരിഞ്ഞുകളയുകയും 'ഞങ്ങൾക്ക് ഞങ്ങളുടെ പ്രവർത്തനങ്ങൾ, നിങ്ങൾക്ക് നിങ്ങളുടെ പ്രവർത്തനങ്ങൾ, നിങ്ങൾക്ക് സലാം. ഞങ്ങൾ വിവരദോഷികളെ തേടുന്നില്ല' എന്ന് പറയുകയും ചെയ്യും.",
    "65:3 അവൻ കണക്കാക്കാത്ത വഴിക്ക് അവന് ഉപജീവനം നൽകുകയും ചെയ്യും. ആരെങ്കിലും അല്ലാഹുവിൽ ഭരമേൽപിക്കുന്ന പക്ഷം അവന് അല്ലാഹു മതിയാകും. തീർച്ചയായും അല്ലാഹു തൻ്റെ കാര്യം പൂർത്തിയാക്കുന്നവനാണ്. തീർച്ചയായും അല്ലാഹു ഓരോ കാര്യത്തിനും ഒരു നിശ്ചിത കണക്ക് ഏർപ്പെടുത്തിയിട്ടുണ്ട്.",
    "16:127 നീ ക്ഷമിക്കുക. നിൻ്റെ ക്ഷമ അല്ലാഹുവിനെക്കൊണ്ടു മാത്രമാണ്. അവരെപ്പറ്റി നീ ദുഃഖിക്കരുത്. അവർ തന്ത്രം പ്രയോഗിക്കുന്നതിൻ്റെ പേരിൽ നീ പ്രയാസത്തിലാകുകയും അരുത്.",
    "70:5 അതിനാൽ നീ ഭംഗിയായ ക്ഷമയോടെ ക്ഷമിക്കുക.",
    "74:7 നിൻ്റെ രക്ഷിതാവിനുവേണ്ടി നീ ക്ഷമിക്കുക.",
    "29:69 ആരെങ്കിലും നമ്മുടെ മാർഗ്ഗത്തിൽ കഠിനാധ്വാനം ചെയ്യുന്ന പക്ഷം തീർച്ചയായും നമ്മുടെ വഴികളിലേക്ക് നാം അവരെ നയിക്കും. തീർച്ചയായും അല്ലാഹു സുകൃതം ചെയ്യുന്നവരോടൊപ്പമാണ്.",
    "2:45 ക്ഷമയും നമസ്കാരവും മുഖേന നിങ്ങൾ സഹായം തേടുക. തീർച്ചയായും അത് ഭയഭക്തിയുള്ളവർക്കല്ലാതെ വലിയ ഭാരം തന്നെയാണ്.",
    "2:155-156 🔓 ഭയം, വിശപ്പ്, സ്വത്തുക്കൾ, ജീവൻ, വിളവുകൾ എന്നിവയിൽ ചിലത് നൽകി നാം നിങ്ങളെ തീർച്ചയായും പരീക്ഷിക്കും. ക്ഷമിക്കുന്നവർക്ക് നീ സന്തോഷവാർത്ത അറിയിക്കുക. (155) അവർക്ക് വല്ല ആപത്തും ബാധിച്ചാൽ 'തീർച്ചയായും ഞങ്ങൾ അല്ലാഹുവിൻ്റേതാണ്, തീർച്ചയായും ഞങ്ങൾ അവങ്കലേക്ക് മടങ്ങുന്നവരാണ്' എന്ന് പറയുന്നവരത്രേ അവർ. (156)",
    "94:5-6 എന്നാൽ തീർച്ചയായും ഞെരുക്കത്തോടൊപ്പം എളുപ്പമുണ്ട്. (5) തീർച്ചയായും ഞെരുക്കത്തോടൊപ്പം എളുപ്പമുണ്ട്. (6)",
    "16:126 നിങ്ങൾ ശിക്ഷിക്കുകയാണെങ്കിൽ നിങ്ങളോട് ചെയ്തതിന് സമാനമായ ശിക്ഷ നൽകുക. നിങ്ങൾ ക്ഷമിക്കുകയാണെങ്കിൽ തീർച്ചയായും അത് ക്ഷമിക്കുന്നവർക്ക് ഏറ്റവും ഉത്തമമാണ്.",
    "39:10 പറയുക: 'എൻ്റെ ദാസന്മാരായ സത്യവിശ്വാസികളേ, നിങ്ങളുടെ രക്ഷിതാവിനെ സൂക്ഷിക്കുക. ഈ ദുനിയാവിൽ സുകൃതം ചെയ്തവർക്ക് നന്മയുണ്ട്. അല്ലാഹുവിൻ്റെ ഭൂമി വിശാലമാണ്. ക്ഷമിക്കുന്നവർക്ക് മാത്രമാണ് അവരുടെ പ്രതിഫലം കണക്കില്ലാതെ പൂർണ്ണമായി നൽകപ്പെടുന്നത്.'",
    "5:13 അപ്പോൾ അവർ തങ്ങളുടെ കരാർ ലംഘിച്ചതുകൊണ്ട് നാം അവരെ ശപിക്കുകയും അവരുടെ ഹൃദയങ്ങളെ കഠിനമാക്കുകയും ചെയ്തു. അവർ വാക്കുകളെ അവയുടെ സ്ഥാനങ്ങളിൽ നിന്ന് മാറ്റിയെഴുതുന്നു. അവർക്ക് ഉപദേശം നൽകപ്പെട്ടതിൽ ഒരു വിഹിതം അവർ മറന്നുകളയുകയും ചെയ്തു. അവരിൽ നിന്ന് അൽപം പേർ ഒഴികെ നീ അവരിൽ നിന്ന് വഞ്ചന കണ്ടുകൊണ്ടേയിരിക്കും. അതിനാൽ നീ അവർക്ക് മാപ്പുനൽകുകയും വിട്ടുവീഴ്ച കാണിക്കുകയും ചെയ്യുക. തീർച്ചയായും അല്ലാഹു സുകൃതം ചെയ്യുന്നവരെ ഇഷ്ടപ്പെടുന്നു.",
    "24:22 നിങ്ങളുടെ കൂട്ടത്തിൽ ഉന്നത സ്ഥാനമുള്ളവരും കഴിവുള്ളവരും കുടുംബബന്ധമുള്ളവർക്കും അഗതികൾക്കും അല്ലാഹുവിൻ്റെ മാർഗ്ഗത്തിൽ പലായനം ചെയ്തവർക്കും നൽകാത്തതിൽ സത്യം ചെയ്യരുത്. അവർ മാപ്പുനൽകുകയും വിട്ടുവീഴ്ച കാണിക്കുകയും ചെയ്യട്ടെ. അല്ലാഹു നിങ്ങൾക്ക് പൊറുത്തുതരുന്നത് നിങ്ങൾക്ക് ഇഷ്ടമല്ലേ? അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "45:14 സത്യവിശ്വാസികളോട് പറയുക: അല്ലാഹുവിൻ്റെ ദിനങ്ങളെ പ്രതീക്ഷിക്കാത്തവർക്ക് അവർ പൊറുത്തുകൊടുക്കട്ടെ. ഒരു ജനതയ്ക്ക് അവർ ചെയ്തതിൻ്റെ പ്രതിഫലം നൽകാൻ വേണ്ടിയാണിത്.",
    "64:14 സത്യവിശ്വാസികളേ, നിങ്ങളുടെ ഭാര്യമാരിലും മക്കളിലും നിങ്ങൾക്ക് ശത്രുക്കളുണ്ട്. അതിനാൽ അവരെ സൂക്ഷിക്കുക. നിങ്ങൾ മാപ്പുനൽകുകയും വിട്ടുവീഴ്ച കാണിക്കുകയും പൊറുത്തുകൊടുക്കുകയും ചെയ്താൽ തീർച്ചയായും അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "15:85 നാം ആകാശങ്ങളെയും ഭൂമിയെയും അവയ്ക്കിടയിലുള്ളതിനെയും യാഥാർത്ഥ്യമല്ലാതെ സൃഷ്ടിച്ചിട്ടില്ല. തീർച്ചയായും അന്ത്യനാൾ വരാൻ പോകുകയാണ്. അതിനാൽ നീ ഭംഗിയായ വിട്ടുവീഴ്ച കാണിക്കുക.",
    "3:159 അല്ലാഹുവിൽ നിന്നുള്ള കാരുണ്യം നിമിത്തമാണ് നീ അവരോട് സൗമ്യത കാണിച്ചത്. നീ പരുഷസ്വഭാവിയും കഠിനഹൃദയനുമായിരുന്നെങ്കിൽ അവർ നിൻ്റെ ചുറ്റിൽ നിന്ന് പിരിഞ്ഞുപോകുമായിരുന്നു. അതിനാൽ നീ അവർക്ക് മാപ്പുനൽകുകയും അവർക്കുവേണ്ടി പാപമോചനം തേടുകയും കാര്യങ്ങളിൽ അവരുമായി കൂടിയാലോചിക്കുകയും ചെയ്യുക. നീ ഒരു കാര്യം ചെയ്യാൻ തീരുമാനിച്ചാൽ അല്ലാഹുവിൽ ഭരമേൽപിക്കുക. തീർച്ചയായും അല്ലാഹു ഭരമേൽപ്പിക്കുന്നവരെ ഇഷ്ടപ്പെടുന്നു.",
    "17:53 എൻ്റെ ദാസന്മാരോട് പറയുക: അവർ ഏറ്റവും നല്ലത് പറയട്ടെ. തീർച്ചയായും പിശാച് അവർക്കിടയിൽ കുഴപ്പം ഉണ്ടാക്കുന്നു. തീർച്ചയായും പിശാച് മനുഷ്യന് വ്യക്തമായ ശത്രുവാണ്."
]


Ml_sad_verses = [
    "2:155-156 🔓 ഭയം, വിശപ്പ്, സ്വത്തുക്കൾ, ജീവൻ, വിളവുകൾ എന്നിവയിൽ ചിലത് നൽകി നാം നിങ്ങളെ തീർച്ചയായും പരീക്ഷിക്കും. ക്ഷമിക്കുന്നവർക്ക് നീ സന്തോഷവാർത്ത അറിയിക്കുക. (155) അവർക്ക് വല്ല ആപത്തും ബാധിച്ചാൽ 'തീർച്ചയായും ഞങ്ങൾ അല്ലാഹുവിൻ്റേതാണ്, തീർച്ചയായും ഞങ്ങൾ അവങ്കലേക്ക് മടങ്ങുന്നവരാണ്' എന്ന് പറയുന്നവരത്രേ അവർ. (156)",
    "94:5-6 🔓 എന്നാൽ തീർച്ചയായും ഞെരുക്കത്തോടൊപ്പം എളുപ്പമുണ്ട്. (5) തീർച്ചയായും ഞെരുക്കത്തോടൊപ്പം എളുപ്പമുണ്ട്. (6)",
    "2:286 അല്ലാഹു ഒരാൾക്കും അവൻ്റെ കഴിവിലുപരി ഭാരം ചുമത്തുന്നില്ല. ഓരോരുത്തർക്കും അവർ ചെയ്തതിൻ്റെ ഫലം ലഭിക്കും. അവർ സമ്പാദിച്ചതിൻ്റെ ബാധ്യത അവർക്ക് തന്നെയാണ്. 'ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾ മറക്കുകയോ തെറ്റിപ്പോകുകയോ ചെയ്താൽ ഞങ്ങളെ ശിക്ഷിക്കരുതേ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്ക് മുമ്പുള്ളവരുടെ മേൽ നീ ചുമത്തിയതുപോലെ ഞങ്ങളുടെ മേൽ ഭാരം ചുമത്തരുതേ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്ക് താങ്ങാൻ കഴിയാത്തത് ഞങ്ങളെ ചുമത്തരുതേ. ഞങ്ങൾക്ക് മാപ്പുനൽകുകയും ഞങ്ങൾക്ക് പൊറുത്തുതരികയും ഞങ്ങളോട് കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി. അതിനാൽ സത്യനിഷേധികളായ ജനതക്കെതിരെ ഞങ്ങളെ സഹായിക്കേണമേ.'",
    "65:3 അവൻ കണക്കാക്കാത്ത വഴിക്ക് അവന് ഉപജീവനം നൽകുകയും ചെയ്യും. ആരെങ്കിലും അല്ലാഹുവിൽ ഭരമേൽപിക്കുന്ന പക്ഷം അവന് അല്ലാഹു മതിയാകും. തീർച്ചയായും അല്ലാഹു തൻ്റെ കാര്യം പൂർത്തിയാക്കുന്നവനാണ്. തീർച്ചയായും അല്ലാഹു ഓരോ കാര്യത്തിനും ഒരു നിശ്ചിത കണക്ക് ഏർപ്പെടുത്തിയിട്ടുണ്ട്.",
    "64:11 അല്ലാഹുവിൻ്റെ അനുമതിയില്ലാതെ യാതൊരു ആപത്തും സംഭവിക്കുകയില്ല. ആരെങ്കിലും അല്ലാഹുവിൽ വിശ്വസിക്കുന്ന പക്ഷം അവൻ്റെ ഹൃദയത്തെ അവൻ നേർവഴിയിലാക്കും. അല്ലാഹു എല്ലാ കാര്യങ്ങളെക്കുറിച്ചും അറിയുന്നവനാണ്.",
    "21:35 ഓരോ ജീവനും മരണത്തെ ആസ്വദിക്കുന്നതാണ്. നന്മയും തിന്മയും കൊണ്ട് പരീക്ഷിക്കപ്പെടുന്നതിന് നാം നിങ്ങളെ പരീക്ഷിക്കും. നമ്മുടെ അടുത്തേക്കാണ് നിങ്ങൾ മടങ്ങുന്നത്.",
    "3:139 നിങ്ങൾ ദുർബലരാകരുത്, ദുഃഖിക്കുകയും അരുത്. നിങ്ങൾ സത്യവിശ്വാസികളാണെങ്കിൽ നിങ്ങൾ തന്നെയാണ് ഉന്നതർ.",
    "2:186 എൻ്റെ ദാസന്മാർ എന്നെപ്പറ്റി നിന്നോട് ചോദിച്ചാൽ, ഞാൻ അടുത്തുള്ളവനാണ് (എന്ന് പറയുക). എന്നോട് പ്രാർത്ഥിക്കുന്നവൻ്റെ പ്രാർത്ഥനയ്ക്ക് ഞാൻ ഉത്തരം നൽകുന്നു. അതിനാൽ അവർ എൻ്റെ വിളിക്ക് ഉത്തരം നൽകുകയും എന്നിൽ വിശ്വസിക്കുകയും ചെയ്യട്ടെ. അവർ നേർമാർഗ്ഗം പ്രാപിക്കാൻ വേണ്ടി.",
    "13:28 വിശ്വസിക്കുകയും അല്ലാഹുവിൻ്റെ സ്മരണയാൽ മനസ്സുകൾക്ക് സമാധാനം ലഭിക്കുകയും ചെയ്യുന്നവർ. ശ്രദ്ധിക്കുക, അല്ലാഹുവിൻ്റെ സ്മരണയിലൂടെയാണ് മനസ്സുകൾക്ക് സമാധാനം ലഭിക്കുന്നത്.",
    "50:16 തീർച്ചയായും നാം മനുഷ്യനെ സൃഷ്ടിച്ചിരിക്കുന്നു. അവൻ്റെ മനസ്സ് അവനോട് മന്ത്രിക്കുന്നതെന്തും നാം അറിയുന്നു. നാം അവനോട് ജീവനാഡിയേക്കാൾ അടുത്തവനാണ്.",
    "42:28 അവനാണ് അവർ നിരാശരായിക്കഴിഞ്ഞതിന് ശേഷം മഴ വർഷിപ്പിക്കുകയും തൻ്റെ കാരുണ്യം വ്യാപിപ്പിക്കുകയും ചെയ്യുന്നത്. അവനാണ് രക്ഷാധികാരിയും സ്തുത്യർഹനും.",
    "39:53 പറയുക: 'എൻ്റെ ദാസന്മാരേ, സ്വന്തം ആത്മാക്കളോട് അതിക്രമം കാണിച്ചവരേ, അല്ലാഹുവിൻ്റെ കാരുണ്യത്തെക്കുറിച്ച് നിങ്ങൾ നിരാശരാകരുത്. തീർച്ചയായും അല്ലാഹു എല്ലാ പാപങ്ങളും പൊറുത്തുകൊടുക്കുന്നു. തീർച്ചയായും അവൻ ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.'",
    "16:97 ആരെങ്കിലും ഒരു സൽക്കർമ്മം പ്രവർത്തിക്കുകയും അവൻ സത്യവിശ്വാസിയായിരിക്കുകയും ചെയ്താൽ - പുരുഷനോ സ്ത്രീയോ ആകട്ടെ - നാം അവന് നല്ല ജീവിതം നൽകും. അവർ പ്രവർത്തിച്ചതിൽ വെച്ച് ഏറ്റവും ഉത്തമമായത് അനുസരിച്ച് നാം അവർക്ക് പ്രതിഫലം നൽകുകയും ചെയ്യും.",
    "10:25 അല്ലാഹു ശാന്തിയുടെ ഭവനത്തിലേക്ക് ക്ഷണിക്കുന്നു. താൻ ഉദ്ദേശിക്കുന്നവരെ അവൻ നേർമാർഗ്ഗത്തിലേക്ക് നയിക്കുന്നു.",
    "18:88 ആരെങ്കിലും വിശ്വസിക്കുകയും സൽക്കർമ്മം പ്രവർത്തിക്കുകയും ചെയ്താൽ അവന് നല്ല പ്രതിഫലമുണ്ട്. അവനോട് നമ്മുടെ കാര്യത്തിൽ നാം എളുപ്പമുള്ളത് കൽപ്പിക്കും.",
    "29:69 ആരെങ്കിലും നമ്മുടെ മാർഗ്ഗത്തിൽ കഠിനാധ്വാനം ചെയ്യുന്ന പക്ഷം തീർച്ചയായും നമ്മുടെ വഴികളിലേക്ക് നാം അവരെ നയിക്കും. തീർച്ചയായും അല്ലാഹു സുകൃതം ചെയ്യുന്നവരോടൊപ്പമാണ്.",
    "8:46 അല്ലാഹുവിനെയും അവൻ്റെ ദൂതനെയും അനുസരിക്കുക. നിങ്ങൾ ഭിന്നിക്കരുത്. അപ്പോൾ നിങ്ങൾക്ക് ധൈര്യം നഷ്ടപ്പെടുകയും നിങ്ങളുടെ ശക്തി ഇല്ലാതാകുകയും ചെയ്യും. ക്ഷമിക്കുക. തീർച്ചയായും അല്ലാഹു ക്ഷമിക്കുന്നവരോടൊപ്പമാണ്.",
    "3:146 എത്രയെത്ര പ്രവാചകന്മാരാണ് തങ്ങളോടൊപ്പം ധാരാളം ഭക്തന്മാരുമായി യുദ്ധം ചെയ്തത്! അല്ലാഹുവിൻ്റെ മാർഗ്ഗത്തിൽ തങ്ങൾക്ക് സംഭവിച്ചതിൻ്റെ പേരിൽ അവർ ദുർബലരാകുകയോ ബലഹീനരാകുകയോ കീഴ്പ്പെടുകയോ ചെയ്തില്ല. അല്ലാഹു ക്ഷമിക്കുന്നവരെ ഇഷ്ടപ്പെടുന്നു.",
    "12:87 എൻ്റെ മക്കളേ, നിങ്ങൾ പോയി യൂസുഫിനെയും അവൻ്റെ സഹോദരനെയും കുറിച്ച് അന്വേഷിക്കുക. അല്ലാഹുവിൻ്റെ കാരുണ്യത്തെക്കുറിച്ച് നിങ്ങൾ നിരാശരാകരുത്. സത്യനിഷേധികളായ ജനതയല്ലാതെ അല്ലാഹുവിൻ്റെ കാരുണ്യത്തെക്കുറിച്ച് നിരാശരാകുകയില്ല.",
    "30:50 അപ്പോൾ അല്ലാഹുവിൻ്റെ കാരുണ്യത്തിൻ്റെ അടയാളങ്ങളിലേക്ക് നോക്കുക: മരിച്ചതിന് ശേഷം എങ്ങനെയാണ് അവൻ ഭൂമിയെ ജീവിപ്പിക്കുന്നത്! തീർച്ചയായും അവൻ മരിച്ചവരെ ജീവിപ്പിക്കുന്നവൻ തന്നെയാണ്. അവൻ എല്ലാ കാര്യങ്ങൾക്കും കഴിവുള്ളവനാണ്.",
    "11:88 അദ്ദേഹം പറഞ്ഞു: 'എൻ്റെ ജനങ്ങളെ, നിങ്ങൾ കണ്ടുവോ, ഞാൻ എൻ്റെ രക്ഷിതാവിൽ നിന്നുള്ള വ്യക്തമായ തെളിവിൻ്റെ അടിസ്ഥാനത്തിലായിരിക്കുകയും അവൻ എനിക്ക് തൻ്റെ അടുക്കൽ നിന്ന് നല്ല ഉപജീവനം നൽകുകയും ചെയ്തിട്ടുണ്ടെങ്കിൽ? ഞാൻ നിങ്ങളെ വിലക്കുന്ന കാര്യത്തിൽ നിങ്ങളോട് വിയോജിക്കാൻ ഞാൻ ഉദ്ദേശിക്കുന്നില്ല. എനിക്ക് കഴിയുന്നത്ര നന്നാക്കുക എന്നതല്ലാതെ ഞാൻ ഉദ്ദേശിക്കുന്നില്ല. എൻ്റെ വിജയം അല്ലാഹുവിനെക്കൊണ്ടു മാത്രമാണ്. അവനിൽ ഞാൻ ഭരമേൽപിച്ചു. അവനിലേക്ക് ഞാൻ ഖേദിച്ച് മടങ്ങുന്നു.'",
    "12:18 അവർ യൂസുഫിൻ്റെ കുപ്പായത്തിൽ കള്ളച്ചോരയുമായി വന്നു. അദ്ദേഹം പറഞ്ഞു: 'അല്ല, നിങ്ങളുടെ മനസ്സുകൾ നിങ്ങൾക്ക് ഒരു കാര്യം ഭംഗിയാക്കിക്കാണിച്ചിരിക്കുന്നു. അതിനാൽ ഭംഗിയായ ക്ഷമ! നിങ്ങൾ വിവരിക്കുന്നതിനെക്കുറിച്ച് അല്ലാഹുവാണ് സഹായിക്കേണ്ടത്.'",
    "90:4 തീർച്ചയായും നാം മനുഷ്യനെ ക്ലേശത്തിൽ സൃഷ്ടിച്ചിരിക്കുന്നു.",
    "46:35 അതിനാൽ ദൃഢചിത്തരായ ദൂതന്മാർ ക്ഷമിച്ചതുപോലെ നീയും ക്ഷമിക്കുക. അവർക്ക് വേണ്ടി നീ ധൃതി കൂട്ടരുത്. അവർക്ക് വാഗ്ദാനം ചെയ്യപ്പെട്ടത് അവർ കാണുന്ന ദിവസം, അവർ ഒരു പകലിൻ്റെ ഒരു മണിക്കൂർ മാത്രമേ താമസിച്ചിട്ടുള്ളൂ എന്ന് അവർക്ക് തോന്നും. ഇതൊരു സന്ദേശമാണ്. ദുർമ്മാർഗ്ഗികളായ ജനതയല്ലാതെ നശിപ്പിക്കപ്പെടുകയില്ല.",
    "2:214 നിങ്ങൾക്ക് മുമ്പ് കഴിഞ്ഞുപോയവർക്ക് സംഭവിച്ചതുപോലെ നിങ്ങൾക്ക് വരാതെ നിങ്ങൾ സ്വർഗ്ഗത്തിൽ പ്രവേശിക്കുമെന്ന് നിങ്ങൾ വിചാരിച്ചുവോ? അവർക്ക് ദാരിദ്ര്യവും ക്ലേശങ്ങളും ബാധിച്ചു. അവർ പ്രകമ്പനം കൊണ്ടു. അങ്ങനെ റസൂലും അദ്ദേഹത്തോടൊപ്പം വിശ്വസിച്ചവരും 'അല്ലാഹുവിൻ്റെ സഹായം എപ്പോഴാണ്?' എന്ന് പറയുന്നതുവരെ. ശ്രദ്ധിക്കുക, അല്ലാഹുവിൻ്റെ സഹായം അടുത്താണ്.",
    "93:3-4 🔓 നിൻ്റെ രക്ഷിതാവ് നിന്നെ കൈവിട്ടിട്ടില്ല, വെറുത്തിട്ടുമില്ല. (3) തീർച്ചയായും പരലോകമാണ് നിനക്ക് ഇഹലോകത്തേക്കാൾ ഉത്തമം. (4)",
    "25:74 ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങളുടെ ഭാര്യമാരിൽ നിന്നും സന്താനങ്ങളിൽ നിന്നും ഞങ്ങൾക്ക് കൺകുളിർമ നൽകുകയും ഞങ്ങളെ സൂക്ഷ്മത പാലിക്കുന്നവർക്ക് മാതൃകയാക്കുകയും ചെയ്യേണമേ എന്ന് പറയുന്നവരും (റഹ്മാൻ്റെ ദാസന്മാരാണ്)."
]


Ml_haram_tendency_verses = [
    "39:53 പറയുക: 'എൻ്റെ ദാസന്മാരേ, സ്വന്തം ആത്മാക്കളോട് അതിക്രമം കാണിച്ചവരേ, അല്ലാഹുവിൻ്റെ കാരുണ്യത്തെക്കുറിച്ച് നിങ്ങൾ നിരാശരാകരുത്. തീർച്ചയായും അല്ലാഹു എല്ലാ പാപങ്ങളും പൊറുത്തുകൊടുക്കുന്നു. തീർച്ചയായും അവൻ ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.'",
    "4:110 ആരെങ്കിലും ഒരു തിന്മ പ്രവർത്തിക്കുകയോ സ്വന്തം ആത്മാവിനോട് അതിക്രമം കാണിക്കുകയോ ചെയ്തതിന് ശേഷം അല്ലാഹുവിനോട് പാപമോചനം തേടുന്ന പക്ഷം, അവൻ അല്ലാഹുവിനെ ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമായി കണ്ടെത്തും.",
    "42:25 അവനാണ് തൻ്റെ ദാസന്മാരിൽ നിന്ന് പശ്ചാത്താപം സ്വീകരിക്കുകയും തിന്മകളെ മാപ്പുനൽകുകയും നിങ്ങൾ ചെയ്യുന്നതെല്ലാം അറിയുകയും ചെയ്യുന്നത്.",
    "5:39 ആരെങ്കിലും തൻ്റെ അതിക്രമത്തിന് ശേഷം പശ്ചാത്തപിക്കുകയും നന്നാക്കുകയും ചെയ്താൽ തീർച്ചയായും അല്ലാഹു അവൻ്റെ പശ്ചാത്താപം സ്വീകരിക്കും. തീർച്ചയായും അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "3:135 നീചവൃത്തികൾ പ്രവർത്തിക്കുകയോ സ്വന്തം ആത്മാക്കളോട് അതിക്രമം കാണിക്കുകയോ ചെയ്താൽ അല്ലാഹുവിനെ ഓർക്കുകയും തങ്ങളുടെ പാപങ്ങൾക്ക് പാപമോചനം തേടുകയും ചെയ്യുന്നവർ. പാപങ്ങൾ പൊറുക്കാൻ അല്ലാഹുവല്ലാതെ ആരുണ്ട്? അവർ അറിഞ്ഞുകൊണ്ട് തങ്ങൾ ചെയ്തതിൽ ഉറച്ചുനിൽക്കാത്തവരാണ്.",
    "65:2-3 അങ്ങനെ അവർ തങ്ങളുടെ അവധിയിലെത്തിയാൽ അവരെ മര്യാദപ്രകാരം പിടിച്ചുനിർത്തുകയോ മര്യാദപ്രകാരം വേർപെടുത്തുകയോ ചെയ്യുക. നിങ്ങളിൽ നിന്ന് നീതിമാന്മാരായ രണ്ട് പേരെ സാക്ഷികളാക്കുകയും ചെയ്യുക. അല്ലാഹുവിന് വേണ്ടി സാക്ഷ്യം സ്ഥാപിക്കുകയും ചെയ്യുക. അല്ലാഹുവിലും അന്ത്യദിനത്തിലും വിശ്വസിക്കുന്നവർക്ക് ഇതുകൊണ്ട് ഉപദേശം നൽകപ്പെടുന്നു. ആരെങ്കിലും അല്ലാഹുവിനെ സൂക്ഷിക്കുന്ന പക്ഷം അവനൊരു പോംവഴി ഉണ്ടാക്കിക്കൊടുക്കും. (2) അവൻ കണക്കാക്കാത്ത വഴിക്ക് അവന് ഉപജീവനം നൽകുകയും ചെയ്യും. ആരെങ്കിലും അല്ലാഹുവിൽ ഭരമേൽപിക്കുന്ന പക്ഷം അവന് അല്ലാഹു മതിയാകും. തീർച്ചയായും അല്ലാഹു തൻ്റെ കാര്യം പൂർത്തിയാക്കുന്നവനാണ്. തീർച്ചയായും അല്ലാഹു ഓരോ കാര്യത്തിനും ഒരു നിശ്ചിത കണക്ക് ഏർപ്പെടുത്തിയിട്ടുണ്ട്. (3)",
    "33:70-71 🔓 സത്യവിശ്വാസികളേ, നിങ്ങൾ അല്ലാഹുവിനെ സൂക്ഷിക്കുകയും നേരായ വാക്ക് പറയുകയും ചെയ്യുക. (70) എന്നാൽ അവൻ നിങ്ങളുടെ കർമ്മങ്ങളെ നന്നാക്കുകയും നിങ്ങളുടെ പാപങ്ങളെ പൊറുത്തുതരികയും ചെയ്യും. ആരെങ്കിലും അല്ലാഹുവിനെയും അവൻ്റെ ദൂതനെയും അനുസരിക്കുന്ന പക്ഷം അവൻ വലിയ വിജയം നേടിയിരിക്കുന്നു. (71)",
    "2:199 പിന്നീട് ജനങ്ങൾ എവിടെ നിന്ന് മടങ്ങിയോ അവിടെ നിന്ന് നിങ്ങളും മടങ്ങുക. അല്ലാഹുവിനോട് പാപമോചനം തേടുക. തീർച്ചയായും അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "24:31 സത്യവിശ്വാസിനികളോട് പറയുക: അവർ തങ്ങളുടെ ദൃഷ്ടികൾ താഴ്ത്തുകയും തങ്ങളുടെ ഗുഹ്യഭാഗങ്ങൾ സൂക്ഷിക്കുകയും ചെയ്യട്ടെ. തങ്ങളുടെ ഭംഗിയിൽ നിന്ന് വെളിവാകുന്നതല്ലാതെ അവർ വെളിപ്പെടുത്തരുത്. തങ്ങളുടെ ശിരോവസ്ത്രങ്ങൾ മാറുകളിലേക്ക് താഴ്ത്തിയിടുകയും ചെയ്യട്ടെ. തങ്ങളുടെ ഭർത്താക്കന്മാർ, അല്ലെങ്കിൽ പിതാക്കന്മാർ, അല്ലെങ്കിൽ ഭർത്താക്കന്മാരുടെ പിതാക്കന്മാർ, അല്ലെങ്കിൽ തങ്ങളുടെ പുത്രന്മാർ, അല്ലെങ്കിൽ ഭർത്താക്കന്മാരുടെ പുത്രന്മാർ, അല്ലെങ്കിൽ തങ്ങളുടെ സഹോദരന്മാർ, അല്ലെങ്കിൽ സഹോദരന്മാരുടെ പുത്രന്മാർ, അല്ലെങ്കിൽ സഹോദരിമാരുടെ പുത്രന്മാർ, അല്ലെങ്കിൽ തങ്ങളുടെ സ്ത്രീകൾ, അല്ലെങ്കിൽ തങ്ങളുടെ വലതുകൈകൾ ഉടമപ്പെടുത്തിയവർ, അല്ലെങ്കിൽ സ്ത്രീകളോട് ലൈംഗികാസക്തി ഇല്ലാത്ത പുരുഷന്മാരായ സേവകർ, അല്ലെങ്കിൽ സ്ത്രീകളുടെ നഗ്നതയെക്കുറിച്ച് അറിവില്ലാത്ത കുട്ടികൾ എന്നിവരൊഴികെ തങ്ങളുടെ ഭംഗി അവർ വെളിപ്പെടുത്തരുത്. തങ്ങൾ ഒളിപ്പിക്കുന്ന ഭംഗി അറിയുന്നതിന് വേണ്ടി തങ്ങളുടെ കാലുകൾ നിലത്തടിക്കുകയും അരുത്. സത്യവിശ്വാസികളേ, നിങ്ങളെല്ലാവരും അല്ലാഹുവിലേക്ക് പശ്ചാത്തപിക്കുക, നിങ്ങൾക്ക് വിജയം നേടാൻ വേണ്ടി.",
    "4:28 അല്ലാഹു നിങ്ങൾക്ക് ലഘൂകരണം വരുത്താൻ ഉദ്ദേശിക്കുന്നു. മനുഷ്യൻ ബലഹീനനായി സൃഷ്ടിക്കപ്പെട്ടിരിക്കുന്നു.",
    "2:286 അല്ലാഹു ഒരാൾക്കും അവൻ്റെ കഴിവിലുപരി ഭാരം ചുമത്തുന്നില്ല. ഓരോരുത്തർക്കും അവർ ചെയ്തതിൻ്റെ ഫലം ലഭിക്കും. അവർ സമ്പാദിച്ചതിൻ്റെ ബാധ്യത അവർക്ക് തന്നെയാണ്. 'ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾ മറക്കുകയോ തെറ്റിപ്പോകുകയോ ചെയ്താൽ ഞങ്ങളെ ശിക്ഷിക്കരുതേ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്ക് മുമ്പുള്ളവരുടെ മേൽ നീ ചുമത്തിയതുപോലെ ഞങ്ങളുടെ മേൽ ഭാരം ചുമത്തരുതേ. ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്ക് താങ്ങാൻ കഴിയാത്തത് ഞങ്ങളെ ചുമത്തരുതേ. ഞങ്ങൾക്ക് മാപ്പുനൽകുകയും ഞങ്ങൾക്ക് പൊറുത്തുതരികയും ഞങ്ങളോട് കരുണ കാണിക്കുകയും ചെയ്യേണമേ. നീയാണ് ഞങ്ങളുടെ രക്ഷാധികാരി. അതിനാൽ സത്യനിഷേധികളായ ജനതക്കെതിരെ ഞങ്ങളെ സഹായിക്കേണമേ.'",
    "16:97 ആരെങ്കിലും ഒരു സൽക്കർമ്മം പ്രവർത്തിക്കുകയും അവൻ സത്യവിശ്വാസിയായിരിക്കുകയും ചെയ്താൽ - പുരുഷനോ സ്ത്രീയോ ആകട്ടെ - നാം അവന് നല്ല ജീവിതം നൽകും. അവർ പ്രവർത്തിച്ചതിൽ വെച്ച് ഏറ്റവും ഉത്തമമായത് അനുസരിച്ച് നാം അവർക്ക് പ്രതിഫലം നൽകുകയും ചെയ്യും.",
    "29:69 ആരെങ്കിലും നമ്മുടെ മാർഗ്ഗത്തിൽ കഠിനാധ്വാനം ചെയ്യുന്ന പക്ഷം തീർച്ചയായും നമ്മുടെ വഴികളിലേക്ക് നാം അവരെ നയിക്കും. തീർച്ചയായും അല്ലാഹു സുകൃതം ചെയ്യുന്നവരോടൊപ്പമാണ്.",
    "3:102 സത്യവിശ്വാസികളേ, അല്ലാഹുവിനെ യഥാവിധി സൂക്ഷിക്കുക. നിങ്ങൾ മുസ്ലീങ്ങളായിട്ടല്ലാതെ മരിക്കുകയും അരുത്.",
    "3:103 നിങ്ങൾ അല്ലാഹുവിൻ്റെ കയറിൽ മുറുകെ പിടിക്കുകയും ഭിന്നിക്കുകയും അരുത്. നിങ്ങൾക്ക് മേൽ അല്ലാഹു ചെയ്ത അനുഗ്രഹം ഓർക്കുക. നിങ്ങൾ പരസ്പരം ശത്രുക്കളായിരുന്നപ്പോൾ അവൻ നിങ്ങളുടെ ഹൃദയങ്ങളെ ഒരുമിച്ചുചേർക്കുകയും അവൻ്റെ അനുഗ്രഹത്താൽ നിങ്ങൾ സഹോദരങ്ങളായിത്തീരുകയും ചെയ്തു. നിങ്ങൾ നരകത്തിൻ്റെ അഗാധമായ ഒരു ഗർത്തത്തിൻ്റെ വക്കിലായിരുന്നപ്പോൾ അവൻ നിങ്ങളെ അതിൽ നിന്ന് രക്ഷിച്ചു. അപ്രകാരം അല്ലാഹു നിങ്ങൾക്ക് തൻ്റെ ദൃഷ്ടാന്തങ്ങൾ വിവരിച്ചുകൊടുക്കുന്നു, നിങ്ങൾ നേർമാർഗ്ഗം പ്രാപിക്കാൻ വേണ്ടി.",
    "49:13 മനുഷ്യരേ, തീർച്ചയായും നിങ്ങളെ നാം ഒരാണിൽ നിന്നും ഒരു പെണ്ണിൽ നിന്നുമാണ് സൃഷ്ടിച്ചത്. നിങ്ങൾ പരസ്പരം അറിയുന്നതിന് വേണ്ടി നിങ്ങളെ നാം ഗോത്രങ്ങളും വംശങ്ങളുമാക്കി. തീർച്ചയായും അല്ലാഹുവിൻ്റെ അടുക്കൽ നിങ്ങളിൽ ഏറ്റവും ആദരണീയൻ നിങ്ങളിൽ ഏറ്റവും സൂക്ഷ്മതയുള്ളവനാണ്. തീർച്ചയായും അല്ലാഹു എല്ലാം അറിയുന്നവനും സൂക്ഷ്മജ്ഞനുമാണ്.",
    "13:11 അവന് മുന്നിലും പിന്നിലുമായി പിന്തുടരുന്നവരുണ്ട്. അവർ അവനെ അല്ലാഹുവിൻ്റെ കല്പന പ്രകാരം സംരക്ഷിക്കുന്നു. തീർച്ചയായും അല്ലാഹു ഒരു ജനതയ്ക്ക് മാറ്റം വരുത്തുന്നില്ല, അവർ തങ്ങളുടെ ആത്മാവിൽ മാറ്റം വരുത്തുന്നതുവരെ. അല്ലാഹു ഒരു ജനതയ്ക്ക് തിന്മ ഉദ്ദേശിച്ചാൽ അതിനെ തടുക്കാൻ ആരുമില്ല. അവന് പുറമെ അവർക്ക് ഒരു രക്ഷാധികാരിയുമില്ല.",
    "2:45 ക്ഷമയും നമസ്കാരവും മുഖേന നിങ്ങൾ സഹായം തേടുക. തീർച്ചയായും അത് ഭയഭക്തിയുള്ളവർക്കല്ലാതെ വലിയ ഭാരം തന്നെയാണ്.",
    "66:8 സത്യവിശ്വാസികളേ, അല്ലാഹുവിലേക്ക് നിഷ്കളങ്കമായ പശ്ചാത്താപം ചെയ്യുക. നിങ്ങളുടെ രക്ഷിതാവ് നിങ്ങളുടെ തിന്മകളെ മാപ്പുനൽകുകയും താഴ്ഭാഗത്ത് കൂടി നദികൾ ഒഴുകുന്ന സ്വർഗ്ഗത്തോപ്പുകളിൽ നിങ്ങളെ പ്രവേശിപ്പിക്കുകയും ചെയ്യുമെന്ന് പ്രതീക്ഷിക്കപ്പെടുന്നു. അല്ലാഹു പ്രവാചകനെയും അദ്ദേഹത്തോടൊപ്പം വിശ്വസിച്ചവരെയും അന്ന് അപമാനിക്കുകയില്ല. അവരുടെ പ്രകാശം അവരുടെ മുന്നിലൂടെയും വലതുഭാഗങ്ങളിലൂടെയും നീങ്ങിക്കൊണ്ടിരിക്കും. അവർ പറയും: 'ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങളുടെ പ്രകാശം ഞങ്ങൾക്ക് പൂർത്തിയാക്കിത്തരികയും ഞങ്ങൾക്ക് പൊറുത്തുതരികയും ചെയ്യേണമേ. തീർച്ചയായും നീ എല്ലാ കാര്യങ്ങൾക്കും കഴിവുള്ളവനാണ്.'",
    "25:70 പശ്ചാത്തപിക്കുകയും വിശ്വസിക്കുകയും സൽക്കർമ്മം പ്രവർത്തിക്കുകയും ചെയ്തവരൊഴികെ. അങ്ങനെയുള്ളവരുടെ തിന്മകളെ അല്ലാഹു നന്മകളാക്കി മാറ്റും. അല്ലാഹു ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.",
    "7:156 ഈ ദുനിയാവിലും പരലോകത്തും ഞങ്ങൾക്ക് നന്മ രേഖപ്പെടുത്തേണമേ. തീർച്ചയായും ഞങ്ങൾ നിന്നിലേക്ക് മടങ്ങുന്നു. അവൻ (അല്ലാഹു) പറഞ്ഞു: 'എൻ്റെ ശിക്ഷ ഞാൻ ഉദ്ദേശിക്കുന്നവർക്ക് നൽകും. എൻ്റെ കാരുണ്യം എല്ലാ കാര്യങ്ങൾക്കും വിശാലമാണ്. സൂക്ഷ്മത പാലിക്കുന്നവർക്കും സക്കാത്ത് നൽകുന്നവർക്കും എൻ്റെ ദൃഷ്ടാന്തങ്ങളിൽ വിശ്വസിക്കുന്നവർക്കും ഞാൻ അത് രേഖപ്പെടുത്തും.'",
    "17:25 നിങ്ങളുടെ മനസ്സിലുള്ളതിനെക്കുറിച്ച് നിങ്ങളുടെ രക്ഷിതാവ് ഏറ്റവും നന്നായി അറിയുന്നവനാണ്. നിങ്ങൾ സദ്‌വൃത്തരാണെങ്കിൽ തീർച്ചയായും അവൻ പശ്ചാത്തപിച്ച് മടങ്ങുന്നവർക്ക് ഏറെ പൊറുക്കുന്നവനാണ്.",
    "6:54 നമ്മുടെ ദൃഷ്ടാന്തങ്ങളിൽ വിശ്വസിക്കുന്നവർ നിൻ്റെ അടുക്കൽ വന്നാൽ പറയുക: 'നിങ്ങൾക്ക് സലാം! നിങ്ങളുടെ രക്ഷിതാവ് തൻ്റെ മേൽ കാരുണ്യം നിർബന്ധമാക്കിയിരിക്കുന്നു. നിങ്ങളിൽ ആരെങ്കിലും അജ്ഞത കൊണ്ട് ഒരു തിന്മ പ്രവർത്തിക്കുകയും അതിന് ശേഷം പശ്ചാത്തപിക്കുകയും നന്നാക്കുകയും ചെയ്താൽ തീർച്ചയായും അവൻ ഏറെ പൊറുക്കുന്നവനും കരുണാനിധിയുമാണ്.'"
]


def malayalam(request):
    return render(request, 'La_Malayalam.html')

def Ml_anxious(request):
    verse = random.choice(Ml_anxious_verses)
    return render(request, 'anxious.html', {'verse': verse})

def Ml_happy(request):
    verse = random.choice(Ml_happy_verses)
    return render(request, 'happy.html', {'verse': verse})

def Ml_thankful(request):
    verse = random.choice(Ml_thankful_verses)
    return render(request, 'thankful.html', {'verse': verse})

def Ml_lonely(request):
    verse = random.choice(Ml_lonely_verses)
    return render(request, 'lonely.html', {'verse': verse})

def Ml_angry(request):
    verse = random.choice(Ml_angry_verses)
    return render(request, 'angry.html', {'verse': verse})

def Ml_sad(request):
    verse = random.choice(Ml_sad_verses)
    return render(request, 'sad.html', {'verse': verse})

def Ml_haram_tendency(request):
    verse = random.choice(Ml_haram_tendency_verses)
    return render(request, 'haram_tendency.html', {'verse': verse})


#Hindi
Hi_anxious_verses = [
    "3:54 और फ़रेब किया उन काफ़िरों ने और अल्लाह ने उनके दाँव का जवाब दिया और अल्लाह सबसे बेहतर दाँव वाला है।",
    "8:30 और जब काफ़िर तुम्हारे साथ दाँव कर रहे थे कि तुम्हें क़ैद करें या तुम्हें क़त्ल कर दें या तुम्हें निकाल दें, और वो दाँव कर रहे थे और अल्लाह उनके दाँव का जवाब दे रहा था और अल्लाह सबसे बेहतर दाँव वाला है।",
    "13:28 वो जो ईमान लाए और उनके दिलों को अल्लाह की याद से चैन मिलता है सुन लो अल्लाह की याद ही से दिल चैन पाते हैं।",
    "2:45 और सब्र और नमाज़ से मदद माँगो और बेशक नमाज़ ज़रूर भारी है मगर उन पर जो डर रखते हैं।",
    "94:5-6 🔓 तो बेशक मुश्किल के साथ आसानी है। (5) बेशक मुश्किल के साथ आसानी है। (6)",
    "2:286 अल्लाह किसी जान पर उसकी ताक़त से ज़्यादा बोझ नहीं डालता। उसके लिए है जो उसने कमाया और उस पर है जो उसने कमाया। ऐ हमारे रब! अगर हम भूल जाएँ या चूक जाएँ तो हमें न पकड़। ऐ हमारे रब! और हम पर वो बोझ न डाल जो तूने हमसे अगले लोगों पर डाला था। ऐ हमारे रब! और हम पर वो बोझ न डाल जिसकी हमें ताक़त न हो और हमसे दरगुज़र कर और हमें बख़्श दे और हम पर रहम कर। तू हमारा मालिक है तो काफ़िरों की क़ौम पर हमारी मदद फ़रमा।",
    "64:11 कोई मुसीबत नहीं आती मगर अल्लाह के हुक्म से और जो अल्लाह पर ईमान लाए उसके दिल को राह दिखाता है और अल्लाह सब कुछ जानने वाला है।",
    "65:3 और उसे रोज़ी देगा जहाँ से उसका गुमान भी न हो और जो अल्लाह पर भरोसा करे तो अल्लाह उसे काफी है। बेशक अल्लाह अपना काम पूरा करने वाला है। बेशक अल्लाह ने हर चीज़ का एक अंदाज़ा रखा है।",
    "20:46 फ़रमाया डरो नहीं मैं तुम्हारे साथ हूँ सुनता और देखता।",
    "3:173 वो जिनसे लोगों ने कहा कि लोग तुम्हारे लिए बहुत जमा हुए हैं तो उनसे डरो तो उनके ईमान को और ज़्यादा कर दिया और बोले हमें अल्लाह काफी है और वो क्या ही अच्छा काम बनाने वाला।",
    "9:40 अगर तुम उनकी मदद न करो तो अल्लाह ने उनकी मदद की जब उन्हें काफ़िरों ने निकाला। वो दो में से दूसरा था जब दोनों ग़ार में थे। जब वो अपने साथी से फ़रमाते थे ग़म न करो बेशक अल्लाह हमारे साथ है तो अल्लाह ने अपनी तस्कीन उस पर उतारी और उसे ऐसे लश्करों से मदद दी जो तुम्हें नज़र न आए और काफ़िरों की बात नीची कर दी और अल्लाह की बात ही बुलंद है और अल्लाह ज़बरदस्त हिकमत वाला है।",
    "4:81 और कहते हैं कि हम फ़रमाँबरदार हैं फिर जब तुम्हारे पास से निकलकर जाते हैं तो उनमें का एक गिरोह जो कुछ तुम कहते हो उसके सिवा और रात में सलाह करता है और अल्लाह लिख रहा है जो रात को सलाह करते हैं तो उनसे मुँह फेर लो और अल्लाह पर भरोसा रखो और अल्लाह काफी है काम बनाने वाला।",
    "9:51 तुम फ़रमा दो हमें हरगिज़ न पहुँचेगा मगर जो अल्लाह ने हमारे लिए लिख दिया, वो हमारा मौला है और मुसलमानों को अल्लाह ही पर भरोसा चाहिए।",
    "50:16 और हमने आदमी को पैदा किया और हम जानते हैं जो उसके दिल में गुज़रता है और हम उसकी तरफ उसकी रग-ए-जान से भी ज़्यादा क़रीब हैं।",
    "42:28 और वही है जो मेहर बरसाता है उनके ना उम्मीद होने के बाद और अपनी रहमत फैलाता है और वही है काम बनाने वाला हर तारीफ़ के लायक़।",
    "3:159 तो कैसी कुछ अल्लाह की मेहरबानी है कि तुम उन पर नरम दिल हो और अगर तुम ज़रा तुन्द मिज़ाज सख़्त दिल होते तो ज़रूर तुम्हारी गर्द से भाग जाते तो उन्हें माफ़ कर दो और उनके लिए दुआ-ए-मग़फ़िरत करो और काम में उनसे सलाह लो फिर जब पक्की सलाह कर लो तो अल्लाह पर भरोसा करो बेशक अल्लाह भरोसा करने वालों को दोस्त रखता है।",
    "33:3 और अल्लाह पर भरोसा रखो और अल्लाह काफी है कारसाज़।",
    "12:64 कहा क्या मैं तुम पर उसका भरोसा करूँ मगर जैसा इससे पहले उसके भाई पर भरोसा किया था तो अल्लाह सबसे बेहतर निगेहबान और वो सबसे बड़ा मेहरबान।",
    "2:216 तुम पर जिहाद फर्ज़ किया गया और वो तुम्हें नापसंद है और करीब है कि कोई चीज़ तुम्हें बुरी लगे और वो तुम्हारे लिए अच्छी हो और करीब है कि कोई चीज़ तुम्हें अच्छी लगे और वो तुम्हारे लिए बुरी हो और अल्लाह जानता है और तुम नहीं जानते।",
    "3:139 और सुस्त न पड़ो और ग़म न करो और तुम्ही ग़ालिब रहोगे अगर ईमान रखते हो।",
    "16:127 और सब्र करो और तुम्हारा सब्र तो अल्लाह ही की तौफ़ीक़ से है और उन पर ग़म न खाओ और न तंगी में पड़ो उनके फरेब से।",
    "29:2-3 🔓 क्या लोग ये समझते हैं कि यूँही छोड़ दिए जाएँगे कि बस इतना कहने पर कि हम ईमान लाए और उन्हें आज़माया न जाएगा। (2) और बेशक हमने उनसे अगले हुओं को आज़माया तो ज़रूर अल्लाह सच्चे को जान लेगा और ज़रूर झूटों को जान लेगा। (3)",
    "23:115 तो क्या ये समझे थे कि हमने तुम्हें बेकार पैदा किया और ये कि तुम्हें हमारी तरफ लौटना नहीं।",
    "67:2 वो जिसने मौत और ज़िन्दगी पैदा की कि तुम्हें परखे तुम में किसका काम ज़्यादा अच्छा है और वो ज़बरदस्त बख़्शने वाला है।",
    "2:214 क्या तुम ये समझते हो कि जन्नत में चले जाओगे और अभी तुम पर अगलों की सी हालत न आई कि उन्हें सख़्ती और तकलीफ़ पहुँची और हिला डाले गए यहाँ तक कि रसूल और उनके साथ के ईमान वाले पुकार उठे कि अल्लाह की मदद कब आएगी सुन लो बेशक अल्लाह की मदद क़रीब है।",
    "2:155-156 🔓 और ज़रूर हम तुम्हें कुछ ख़ौफ़ और भूख और माल और जानों और फलों की कमी से आज़माएँगे और ख़ुश ख़बरी दो सब्र करने वालों को। (155) कि जब उन पर कोई मुसीबत पड़े तो कहें बेशक हम अल्लाह ही के लिए हैं और बेशक हम उसी की तरफ लौट कर जाने वाले हैं। (156)",
    "2:153 ऐ ईमान वालो! सब्र और नमाज़ से मदद चाहो, बेशक अल्लाह सब्र करने वालों के साथ है।",
    "7:200 और अगर तुम्हें शैतान की तरफ से कोई वस्वसा आए तो अल्लाह की पनाह मांगो बेशक वो सुनने वाला जानने वाला है।",
    "4:58 बेशक अल्लाह तुम्हें हुक्म देता है कि अमानतें उनके हक़दारों को अदा करो और जब तुम लोगों में फ़ैसला करो तो इन्साफ़ से फ़ैसला करो। बेशक अल्लाह तुम्हें क्या ही अच्छी नसीहत फरमाता है। बेशक अल्लाह सुनता देखता है।",
    "17:110 तुम फ़रमा दो अल्लाह कह कर पुकारो या रहमान कह कर पुकारो, जो नाम पुकारो सब उसी के अच्छे नाम हैं और अपनी नमाज़ न बहुत बुलंद आवाज़ से पढ़ो और न बहुत पस्त और इन दोनों के बीच की राह ढूंढो।"
]

Hi_happy_verses = [
    "10:58 (ऐ रसूल) तुम कह दो कि (ये क़ुरान) ख़ुदा के फ़ज़ल व करम और उसकी रहमत से तुमको मिला है (ही) तो उन लोगों को इस पर खुश होना चाहिए। यह उन सब चीज़ों से बेहतर है जिन्हें लोग समेट रहे हैं।", 
    "16:97 जो कुछ नेकी करेगा मर्द हो या औरत और वह ईमान वाला हो तो ज़रूर हम उसे पाक साफ़ उम्दा ज़िंदगी जिलाएँगे और ज़रूर उन्हें उनका नेकी का वह बदला देंगे जो उनके सबसे अच्छे काम थे।", 
    "16:78 और अल्लाह ने तुम्हें तुम्हारी माँओं के पेट से निकाला कि तुम कुछ न जानते थे और तुम्हें कान और आँखें और दिल दिए कि तुम एहसान मानो।",
    "16:10-11 🔓 वही है जिसने आसमान से पानी बरसाया कि उससे तुम्हारे लिए पीने को है और उससे पेड़ हैं जिनमें तुम अपने मवेशी चराते हो। (10) उसी पानी से तुम्हारे लिए खेती और ज़ैतून और खजूरें और अंगूर और हर तरह के फल उगाता है, बेशक इसमें ज़रूर निशानी है सोचने वालों के लिए। (11)",
    "16:80 और अल्लाह ने तुम्हारे घरों को तुम्हारे लिए सुकून की जगह बनाया और चौपायों की खालों से तुम्हारे लिए घर बनाए जिन्हें तुम हल्के पाते हो अपने कूच के दिन और अपने ठहरने के दिन और उनकी ऊन और रुएँ और बालों से बर्ताव का सामान और कुछ मुद्दत तक बरतना।",
    "2:186 और जब मेरे बंदे तुमसे मेरी बाबत पूछें तो मैं नज़दीक हूँ। हर पुकारने वाले की दुआ सुनता हूँ जब वो मुझे पुकारे तो उन्हें भी चाहिए कि मेरी पुकार पर लब्बैक कहें और मुझ पर ईमान लाएँ कि शायद राह पर आ जाएँ।",
    "16:53 और जो भी नेमत तुम्हारे पास है तो वो अल्लाह ही की तरफ से है फिर जब तुम्हें कोई तकलीफ पहुँचती है तो उसी की तरफ चिल्लाते हो।",
    "16:18 और अगर तुम अल्लाह की नेमतें गिनना चाहो तो गिन न सकोगे। बेशक अल्लाह ज़रूर बख़्शने वाला मेहरबान है।",
    "16:81 और अल्लाह ने तुम्हारे लिए अपनी बनाई हुई चीज़ों में से साये बनाए और पहाड़ों में तुम्हारे लिए पनाहगाहें बनाईं और तुम्हारे लिए कपड़े बनाए जो तुम्हें गर्मी से बचाते हैं और कुछ लिबास ऐसे जो तुम्हें लड़ाई से बचाते हैं, इसी तरह वो अपनी नेमत तुम पर पूरी करता है कि तुम फ़र्मांबरदारी करो।",
    "21:35 हर जान को मौत का मज़ा चखना है और हम तुम्हें आज़माते हैं बुराई और भलाई से फितना (परोपकार) के तौर पर और हमारी तरफ लौटाए जाओगे।",
    "2:25 और ख़ुश ख़बरी दो उन्हें जो ईमान लाए और अच्छे काम किए कि उनके लिए बाग़ हैं जिनके नीचे नहरें बहती हैं। जब कभी उन बाग़ों से उन्हें कोई फल रिज़्क दिया जाएगा कहेंगे ये तो वही है जो हमें पहले दिया गया था और वो शक्ल में मिलता-जुलता (दिखाया) जाएगा और उनके लिए उन बाग़ों में सुथरी बीवियाँ हैं और वो उनमें हमेशा रहेंगे।",
    "18:88 और रहा वो जिसने ईमान लाया और अच्छे काम किए तो उसके लिए अच्छी जज़ा है और हम उससे अपनी बात आसान कहेंगे।",
    "10:25 और अल्लाह सलामती के घर (जन्नत) की तरफ बुलाता है और जिसे चाहे सीधी राह दिखाता है।",
    "39:53 तुम फरमा दो ऐ मेरे वह बंदे जिन्होंने अपनी जानों पर ज़्यादती की, अल्लाह की रहमत से नाउम्म्ीद न हो। बेशक अल्लाह सब गुनाह बख़्श देता है। बेशक वही बख़्शने वाला मेहरबान है।",
    "25:70 मगर जिसने तौबा की और ईमान लाया और अच्छा काम किया तो ऐसे लोगों के गुनाहों को अल्लाह नेकियों से बदल देगा और अल्लाह बख़्शने वाला मेहरबान है।",
    "103:1-3 🔓 ज़माने की कसम (1) बेशक आदमी ज़रूर घाटे में है। (2) मगर जो ईमान लाए और अच्छे काम किए और एक दूसरे को हक़ की नसीहत की और एक दूसरे को सब्र की नसीहत की। (3)",
    "4:69 और जो अल्लाह और रसूल का हुक्म माने तो वो उनके साथ होंगे जिन पर अल्लाह ने इनाम किया है या’नी अम्बिया और सिद्दीक़ीन और शुहदा और सालेहीन और वो क्या ही अच्छे साथी हैं।",
    "9:21 उनका रब उन्हें बशारत देता है अपनी रहमत और अपनी रज़ामंदी और उन जन्नतों की जिनमें उनके लिए हमेशा की नेमत है।",
    "13:29 वो जो ईमान लाए और उनके दिलों को अल्लाह की याद से चैन मिलता है सुन लो अल्लाह की याद ही से दिल चैन पाते हैं।",
    "32:17 तो किसी जी को ख़बर नहीं जो हमने उनके लिए आँख की ठंडक छुपा रखी है बदला उस का जो करते थे।",
    "36:55 बेशक जन्नत वाले आज मजे में दिल बहलाते हैं।",
    "43:70 दाख़िल हो जन्नत में तुम और तुम्हारी बीवियाँ ख़ुश किए जाते हो।",
    "76:11 तो अल्लाह ने उन्हें उस दिन के शर से बचाया और उन्हें ताज़गी और ख़ुशी अता फ़रमाई।",
    "89:27-30 🔓 ऐ इत्मीनान वाली जान! (27) अपने रब की तरफ़ लौट, राज़ी और राज़ी की गई। (28) तो मेरे बंदों में दाख़िल हो। (29) और मेरी जन्नत में दाख़िल हो। (30)",
    "48:4 वही है जिसने ईमान वालों के दिलों में इतमीनान उतारा कि उनके ईमान के साथ ईमान और बढ़ जाए और अल्लाह ही के लिए हैं आसमानों और ज़मीन के लश्कर और अल्लाह इल्म वाला हिकमत वाला है।",
    "24:35 अल्लाह आसमानों और ज़मीन का नूर है। उसके नूर की मिसाल ऐसी है जैसे एक ताक़ में चिराग़ हो, चिराग़ एक फानूस में हो, फानूस ऐसा जैसे चमकता हुआ सितारा, वो चिराग़ ज़ैतून के एक मुबारक पेड़ के तेल से रौशन किया जाए जो न पूरबी हो न पच्छमी, क़रीब है कि उसका तेल चमक उठे अगरचे उसे आग न छुए, नूर पर नूर है। अल्लाह अपने नूर की तरफ जिसे चाहे राह दिखाता है और अल्लाह लोगों के लिए मिसालें बयान करता है और अल्लाह सब कुछ जानने वाला है।",
    "55:60 एहसान का बदला एहसान के सिवा कुछ नहीं।",
    "41:30 बेशक वो जिन्होंने कहा हमारा रब अल्लाह है फिर सीधे रहे, उन पर फ़रिश्ते उतरते हैं कि न डरो और न ग़म करो और ख़ुशियाँ मनाओ उस जन्नत की जिसका तुमसे वादा था।"
]


Hi_thankful_verses = [
    "14:7 और जब तुम्हारे रब ने इ’लान फ़रमाया कि अगर तुम शुक्र करोगे तो मैं तुम्हें और ज़्यादा दूँगा और अगर नाशुक्री करोगे तो मेरा अज़ाब ज़रूर सख्त है।",
    "16:78 और अल्लाह ने तुम्हें तुम्हारी माँओं के पेट से निकाला कि तुम कुछ न जानते थे और तुम्हें कान और आँखें और दिल दिए कि तुम एहसान मानो।",
    "2:152 तो मुझे याद करो मैं तुम्हें याद करूँगा और मेरा शुक्र करो और मेरी ना-शुक्र न करो।",
    "2:172 ऐ ईमान वालो! खाओ उन पाकीज़ा चीज़ों में से जो हमने तुम्हें रिज़्क दी और अल्लाह का शुक्र करो अगर तुम उसी की बंदगी करते हो।",
    "27:40 जिस के पास किताब का इल्म था बोला मैं उसे तुम्हारे पास पलक झपकने से पहले ले आऊँगा। फिर जब सुलेमान ने उसे अपने पास रखा हुआ देखा फ़रमाया ये मेरे रब के फ़ज़ल से है ताकि मुझे आजमाए कि मैं शुक्र करता हूँ या ना-शुक्र और जो शुक्र करे तो वो अपनी ही जान का भला करता है और जो ना-शुक्र करे तो मेरा रब बे-नियाज़ है करम वाला।",
    "31:12 और बेशक हमने लुकमान को हिकमत अता फ़रमाई कि अल्लाह का शुक्र कर और जो शुक्र करे तो अपनी ही जान का भला करेगा और जो नाशुक्री करे तो बेशक अल्लाह बे-नियाज़ है हर तारीफ़ के लायक़।",
    "16:53 और जो भी नेमत तुम्हारे पास है तो वो अल्लाह ही की तरफ से है फिर जब तुम्हें कोई तकलीफ पहुँचती है तो उसी की तरफ चिल्लाते हो।",
    "14:34 और तुम्हें अता किया जो कुछ तुमने उससे माँगा और अगर तुम अल्लाह की नेमतें गिनना चाहो तो गिन न सकोगे। बेशक आदमी ज़रूर बड़ा बे-इन्साफ़ ना-शुक्रा है।",
    "34:13 जो कुछ सुलेमान चाहते वो बनाते उनके लिए ऊँचे महल और तस्वीरें और बड़े कुंडे जैसे हौज़ और जमी हुई देगें। ऐ दाऊद की औलाद! शुक्र करते रहो और मेरे बंदों में थोड़े ही शुक्र करने वाले हैं।",
    "3:145 और कोई जान नहीं मर सकती मगर अल्लाह के हुक्म से लिखा हुआ वक़्त है और जो दुनिया का सवाब चाहे हम उसे उससे कुछ देंगे और जो आख़िरत का सवाब चाहे हम उसे उससे कुछ देंगे और हम शुक्र गुज़ार को जल्द सज़ा देंगे।",
    "16:81 और अल्लाह ने तुम्हारे लिए अपनी बनाई हुई चीज़ों में से साये बनाए और पहाड़ों में तुम्हारे लिए पनाहगाहें बनाईं और तुम्हारे लिए कपड़े बनाए जो तुम्हें गर्मी से बचाते हैं और कुछ लिबास ऐसे जो तुम्हें लड़ाई से बचाते हैं, इसी तरह वो अपनी नेमत तुम पर पूरी करता है कि तुम फ़र्मांबरदारी करो।",
    "27:73 और बेशक तुम्हारा रब लोगों पर फ़ज़ल वाला है मगर उनमें अक्सर शुक्र नहीं करते।",
    "55:13 तो तुम दोनों अपने रब की कौन कौन सी ने’मत को झुठलाओगे।",
    "17:3 उन की औलाद जिन्हों हम ने नूह के साथ सवार किया था, बेशक वो बड़ा शुक्र गुज़ार बंदा था।",
    "76:9 हम तुम्हें खाना सिर्फ अल्लाह की रज़ा के लिए खिलाते हैं। हम तुमसे न कोई बदला चाहते हैं न कोई शुक्र।",
    "2:243 क्या तुमने उन्हें न देखा जो अपने घरों से निकले और वो हज़ारों थे मौत के डर से तो अल्लाह ने उनसे फ़रमाया मर जाओ फिर उन्हें ज़िंदा किया। बेशक अल्लाह लोगों पर बड़ा फ़ज़ल करने वाला है लेकिन अक्सर लोग शुक्र नहीं करते।",
    "8:26 और याद करो जब तुम ज़मीन में थोड़े थे कमज़ोर समझे जाते थे डरते थे कि लोग तुम्हें उछल लें तो उसने तुम्हें जगह दी और अपनी मदद से तुम्हें कुव्वत दी और तुम्हें पाकीज़ा रिज़्क दिए कि तुम शुक्र करो।",
    "35:3 ऐ लोगो! अल्लाह का एहसान अपने ऊपर याद करो, क्या अल्लाह के सिवा कोई और ख़ालिक़ है जो तुम्हें आसमान और ज़मीन से रिज़्क दे? कोई मा’बूद नहीं सिवाए उसके तो कहाँ उलटे जा रहे हो।",
    "16:114 तो खाओ जो कुछ अल्लाह ने तुम्हें रिज़्क दिया हलाल पाकीज़ा और अल्लाह की नेमत का शुक्र करो अगर तुम उसी की बंदगी करते हो।",
    "29:17 तुम तो अल्लाह के सिवा मूर्तियों को पूजते हो और झूट बनाते हो। बेशक अल्लाह के सिवा जिनकी तुम पूजा करते हो वो तुम्हें रिज़्क देने का इख़्तियार नहीं रखते तो अल्लाह के पास रिज़्क ढूंढो और उसकी बंदगी करो और उसका शुक्र करो, उसी की तरफ तुम्हें लौटना है।",
    "7:10 और बेशक हमने तुम्हें ज़मीन में जगह दी और तुम्हारे लिए उसमें जीने के सामान किए, बहुत कम शुक्र करते हो।",
    "6:63 तुम फ़रमा दो वो कौन है जो तुम्हें ख़ुश्की और तरी की अँधेरियों से निजात देता है, तुम उसे पुकारते हो गिड़गिड़ाकर और चुपके-चुपके कि अगर वो हमें इससे बचा ले तो ज़रूर हम शुक्र वालों में होंगे।",
    "14:5 और बेशक हमने मूसा को अपनी निशानियाँ देकर भेजा कि अपनी क़ौम को अँधेरों से उजाले की तरफ निकालो और उन्हें अल्लाह के दिन याद दिलाओ, बेशक इसमें हर बड़े सब्र और शुक्र करने वाले के लिए निशानियाँ हैं।",
    "54:35 हमारे पास से इनाम था, हम ऐसा ही बदला देते हैं शुक्र करने वालों को।",
    "17:19 और जो आख़िरत चाहे और उसकी सी कोशिश करे जैसी उसके लिए कोशिश करनी चाहिए और वो ईमान वाला हो तो ऐसे ही लोगों की कोशिश की क़द्र की जाएगी।"
]

Hi_lonely_verses = [
    "50:16 और हमने आदमी को पैदा किया और हम जानते हैं जो उसके दिल में गुज़रता है और हम उसकी तरफ उसकी रग-ए-जान से भी ज़्यादा क़रीब हैं।",
    "2:186 और जब मेरे बंदे तुमसे मेरी बाबत पूछें तो मैं नज़दीक हूँ। हर पुकारने वाले की दुआ सुनता हूँ जब वो मुझे पुकारे तो उन्हें भी चाहिए कि मेरी पुकार पर लब्बैक कहें और मुझ पर ईमान लाएँ कि शायद राह पर आ जाएँ।",
    "57:4 वही है जिसने आसमानों और ज़मीन को छः दिन में बनाया फिर अर्श पर इस्तेवा फ़रमाया। जानता है जो कुछ ज़मीन में जाए और जो कुछ उससे निकले और जो कुछ आसमान से उतरे और जो कुछ उसमें चढ़े और वो तुम्हारे साथ है जहाँ कहीं तुम हो और अल्लाह तुम्हारे कामों को देख रहा है।",
    "20:46 फ़रमाया डरो नहीं मैं तुम्हारे साथ हूँ सुनता और देखता।",
    "4:81 और कहते हैं कि हम फ़रमाँबरदार हैं फिर जब तुम्हारे पास से निकलकर जाते हैं तो उनमें का एक गिरोह जो कुछ तुम कहते हो उसके सिवा और रात में सलाह करता है और अल्लाह लिख रहा है जो रात को सलाह करते हैं तो उनसे मुँह फेर लो और अल्लाह पर भरोसा रखो और अल्लाह काफी है काम बनाने वाला।",
    "19:96 बेशक जो ईमान लाए और अच्छे काम किए अनक़रीब रहमान उनके लिए मोहब्बत पैदा करेगा।",
    "33:41-42 🔓 ऐ ईमान वालो! अल्लाह को बहुत ज़्यादा याद करो। (41) और सुबह और शाम उसकी पाकी बयान करो। (42)",
    "2:45 और सब्र और नमाज़ से मदद माँगो और बेशक नमाज़ ज़रूर भारी है मगर उन पर जो डर रखते हैं।",
    "65:3 और उसे रोज़ी देगा जहाँ से उसका गुमान भी न हो और जो अल्लाह पर भरोसा करे तो अल्लाह उसे काफी है। बेशक अल्लाह अपना काम पूरा करने वाला है। बेशक अल्लाह ने हर चीज़ का एक अंदाज़ा रखा है।",
    "11:123 और अल्लाह ही का है आसमानों और ज़मीन का ग़ैब और उसी की तरफ हर काम लौटता है तो उसी की बंदगी करो और उसी पर भरोसा रखो और तुम्हारा रब बेख़बर नहीं तुम्हारे कामों से।",
    "10:25 और अल्लाह सलामती के घर (जन्नत) की तरफ बुलाता है और जिसे चाहे सीधी राह दिखाता है।",
    "29:69 और जिन्होंने हमारी राह में कोशिश की ज़रूर हम उन्हें अपनी राहें दिखा देंगे और बेशक अल्लाह नेकी करने वालों के साथ है।",
    "13:28 वो जो ईमान लाए और उनके दिलों को अल्लाह की याद से चैन मिलता है सुन लो अल्लाह की याद ही से दिल चैन पाते हैं।",
    "2:257 अल्लाह वाली है ईमान वालों का, उन्हें अँधेरों से नूर की तरफ निकालता है और काफ़िरों के वाली शैतान हैं, वो उन्हें नूर से अँधेरों की तरफ निकालते हैं, ये दोज़ख़ी हैं, वो उसमें हमेशा रहेंगे।",
    "58:7 क्या तुम न देखते कि अल्लाह जानता है जो कुछ आसमानों में है और जो कुछ ज़मीन में है, ऐसी कोई तीन की सरगोशी नहीं होती मगर चौथा वो होता है और न पाँच की मगर छठा वो होता है और न इससे कम और न इससे ज़्यादा की मगर वो उनके साथ होता है जहाँ कहीं वो हों फिर क़यामत के दिन उन्हें उनके किए हुए काम बताएगा। बेशक अल्लाह सब कुछ जानता है।",
    "24:35 अल्लाह आसमानों और ज़मीन का नूर है। उसके नूर की मिसाल ऐसी है जैसे एक ताक़ में चिराग़ हो, चिराग़ एक फानूस में हो, फानूस ऐसा जैसे चमकता हुआ सितारा, वो चिराग़ ज़ैतून के एक मुबारक पेड़ के तेल से रौशन किया जाए जो न पूरबी हो न पच्छमी, क़रीब है कि उसका तेल चमक उठे अगरचे उसे आग न छुए, नूर पर नूर है। अल्लाह अपने नूर की तरफ जिसे चाहे राह दिखाता है और अल्लाह लोगों के लिए मिसालें बयान करता है और अल्लाह सब कुछ जानने वाला है।",
    "94:1-4 🔓 क्या हमने तुम्हारे लिए तुम्हारा सीना न खोल दिया? (1) और तुम पर से तुम्हारा बोझ उतार दिया। (2) जिसने तुम्हारी कमर तोड़ दी थी। (3) और हमने तुम्हारे लिए तुम्हारी शोहरत बुलंद कर दी। (4)",
    "23:60 और वो कि जो कुछ देना हो देते हैं और उनके दिल डर रहे हैं कि उन्हें अपने रब की तरफ लौटना है।",
    "2:153 ऐ ईमान वालो! सब्र और नमाज़ से मदद चाहो, बेशक अल्लाह सब्र करने वालों के साथ है।",
    "4:108 लोगों से छिपते हैं और अल्लाह से नहीं छिपते और वो उनके साथ होता है जब वो रात को ऐसी बात का मुशावरा करते हैं जिससे वो राज़ी नहीं और अल्लाह उनके काम को घेरे हुए है।",
    "4:147 अल्लाह तुम्हें अज़ाब देकर क्या करेगा अगर तुम शुक्र करो और ईमान लाओ और अल्लाह बड़ा क़द्रदान है जानने वाला।",
    "2:62 बेशक जो ईमान वाले हैं और यहूदी और नसरानी और साबईन जो कोई अल्लाह और क़यामत पर ईमान लाए और अच्छा काम किया तो उनका सवाब उनके रब के पास है और उन पर न कोई ख़ौफ़ है न वो ग़म करेंगे।",
    "94:7-8 🔓 तो जब फ़ारिग़ हो तो (इबादत में) मेहनत करो। (7) और अपने रब ही की तरफ़ रग़बत करो। (8)"
]


Hi_angry_verses = [
    "42:40 और बुराई का बदला उसी जैसी बुराई है तो जो माफ़ कर दे और सुलह कर ले तो उसका अजर अल्लाह पर है। बेशक वो ज़ालिमों को पसंद नहीं करता।",
    "42:37 और वो जो बड़े गुनाहों और बे हयाइयों से बचते हैं और जब उन्हें गुस्सा आए तो वो माफ़ कर देते हैं।",
    "3:134 वो जो ख़ुशहाली और तंगी में ख़र्च करते हैं और गुस्से को पी जाने वाले और लोगों से दरगुज़र करने वाले और अल्लाह नेकी करने वालों को दोस्त रखता है।",
    "7:199 माफ़ करने का तरीक़ा इख़्तियार करो और भलाई का हुक्म दो और जाहिलों से मुँह फेर लो।",
    "41:34 और नेकी और बदी बराबर नहीं, तुम बुराई को उस चीज़ से टालो जो सबसे अच्छी हो तो फौरन वो जिसकी तुमसे दुश्मनी थी ऐसा हो जाएगा जैसे कोई गहरा दोस्त।",
    "42:43 और बेशक जो सब्र करे और बख़्श दे तो बेशक ये बड़े हिम्मत के कामों में से है।",
    "25:63 और रहमान के बंदे वो हैं जो ज़मीन पर आहिस्ता चलते हैं और जब जाहिल उनसे बात करें तो कहते हैं सलामती।",
    "28:55 और जब बकवास सुनें तो उससे मुँह फेर लें और कहें हमें हमारे अमल और तुम्हें तुम्हारे अमल, तुम पर सलामती हो हम जाहिलों को नहीं चाहते।",
    "65:3 और उसे रोज़ी देगा जहाँ से उसका गुमान भी न हो और जो अल्लाह पर भरोसा करे तो अल्लाह उसे काफी है। बेशक अल्लाह अपना काम पूरा करने वाला है। बेशक अल्लाह ने हर चीज़ का एक अंदाज़ा रखा है।",
    "16:127 और सब्र करो और तुम्हारा सब्र तो अल्लाह ही की तौफ़ीक़ से है और उन पर ग़म न खाओ और न तंगी में पड़ो उनके फरेब से।",
    "70:5 तो तुम अच्छी तरह सब्र करो।",
    "74:7 और अपने रब के लिए सब्र करो।",
    "29:69 और जिन्होंने हमारी राह में कोशिश की ज़रूर हम उन्हें अपनी राहें दिखा देंगे और बेशक अल्लाह नेकी करने वालों के साथ है।",
    "2:45 और सब्र और नमाज़ से मदद माँगो और बेशक नमाज़ ज़रूर भारी है मगर उन पर जो डर रखते हैं।",
    "2:155-156 🔓 और ज़रूर हम तुम्हें कुछ ख़ौफ़ और भूख और माल और जानों और फलों की कमी से आज़माएँगे और ख़ुश ख़बरी दो सब्र करने वालों को। (155) कि जब उन पर कोई मुसीबत पड़े तो कहें बेशक हम अल्लाह ही के लिए हैं और बेशक हम उसी की तरफ लौट कर जाने वाले हैं। (156)",
    "94:5-6 🔓 तो बेशक मुश्किल के साथ आसानी है। (5) बेशक मुश्किल के साथ आसानी है। (6)",
    "16:126 और अगर तुम बदला लो तो उतना ही बदला लो जितनी तुम्हें तकलीफ़ पहुँची और अगर सब्र करो तो बेशक सब्र करने वालों के लिए यही बेहतर है।",
    "39:10 तुम फ़रमा दो ऐ मेरे बंदो जो ईमान लाए अपने रब से डरो। जिनके लिए इस दुनिया में भलाई की वो उनके लिए भलाई है और अल्लाह की ज़मीन वसी’अ है। सिर्फ सब्र करने वालों को उनका अज्र बे-हिसाब पूरा दिया जाएगा।",
    "5:13 तो उनकी अहद शिकनी (वादे तोड़ने) के सबब हमने उन पर लानत की और उनके दिलों को सख़्त कर दिया। वो कलाम को उसके मौक़े’ से बदल देते हैं और वो हिस्सा भूल गए जो उन्हें याद कराया गया था और तुम हमेशा उनमें किसी न किसी दग़ा पर इत्तेला’ पाते रहोगे मगर थोड़े से उनमें के तो उनसे दरगुज़र करो और जाने दो। बेशक अल्लाह नेकी करने वालों को दोस्त रखता है।",
    "24:22 और क़सम न खाएँ अहले फ़ज़ल तुम में से और गुंजाइश वाले कि क़राबतदारों और मिस्कीनों और अल्लाह की राह में हिजरत करने वालों को न देंगे और चाहिए कि माफ़ करें और दरगुज़र करें। क्या तुम ये पसंद नहीं करते कि अल्लाह तुम्हें बख़्श दे? और अल्लाह बख़्शने वाला मेहरबान है।",
    "45:14 तुम ईमान वालों से कह दो कि उनको माफ़ कर दें जो अल्लाह के दिनों की उम्मीद नहीं रखते ताकि अल्लाह एक क़ौम को उनके किए का बदला दे।",
    "64:14 ऐ ईमान वालो! बेशक तुम्हारी कुछ बीवियाँ और तुम्हारी कुछ औलादें तुम्हारी दुश्मन हैं तो उनसे बचो और अगर तुम माफ़ करो और दरगुज़र करो और बख़्श दो तो बेशक अल्लाह बख़्शने वाला मेहरबान है।",
    "15:85 और हमने आसमान और ज़मीन और जो कुछ उनके दरमियान है सिर्फ़ हक़ के साथ बनाया है और बेशक क़यामत ज़रूर आने वाली है तो अच्छी तरह दरगुज़र करो।",
    "3:159 तो कैसी कुछ अल्लाह की मेहरबानी है कि तुम उन पर नरम दिल हो और अगर तुम ज़रा तुन्द मिज़ाज सख़्त दिल होते तो ज़रूर तुम्हारी गर्द से भाग जाते तो उन्हें माफ़ कर दो और उनके लिए दुआ-ए-मग़फ़िरत करो और काम में उनसे सलाह लो फिर जब पक्की सलाह कर लो तो अल्लाह पर भरोसा करो बेशक अल्लाह भरोसा करने वालों को दोस्त रखता है।",
    "17:53 और मेरे बंदों से कहो वो बात कहें जो सबसे अच्छी हो बेशक शैतान आपस में बिगाड़ डालता है, बेशक शैतान आदमी का खुला दुश्मन है।"
]

Hi_sad_verses = [
    "2:155-156 🔓 और ज़रूर हम तुम्हें कुछ ख़ौफ़ और भूख और माल और जानों और फलों की कमी से आज़माएँगे और ख़ुश ख़बरी दो सब्र करने वालों को। (155) कि जब उन पर कोई मुसीबत पड़े तो कहें बेशक हम अल्लाह ही के लिए हैं और बेशक हम उसी की तरफ लौट कर जाने वाले हैं। (156)",
    "94:5-6 🔓 तो बेशक मुश्किल के साथ आसानी है। (5) बेशक मुश्किल के साथ आसानी है। (6)",
    "2:286 अल्लाह किसी जान पर उसकी ताक़त से ज़्यादा बोझ नहीं डालता, उसके लिए है जो उसने कमाया और उस पर है जो उसने इख़्तियार किया। ऐ हमारे रब! अगर हम भूले या ख़ता की तो हमें न पकड़। ऐ हमारे रब! और हम पर वो बोझ न डाल जैसा तूने हमसे अगले लोगों पर डाला था। ऐ हमारे रब! और हम पर वो बोझ न डाल जिसकी हमें ताक़त न हो और हमसे दरगुज़र कर और हमें बख़्श दे और हम पर रहम कर। तू हमारा मालिक है तो हमें काफ़िरों पर मदद दे।",
    "65:3 और उसे रोज़ी देगा जहाँ से उसका गुमान भी न हो और जो अल्लाह पर भरोसा करे तो अल्लाह उसे काफी है। बेशक अल्लाह अपना काम पूरा करने वाला है। बेशक अल्लाह ने हर चीज़ का एक अंदाज़ा रखा है।",
    "64:11 कोई मुसीबत नहीं पहुँचती मगर अल्लाह के हुक्म से और जो अल्लाह पर ईमान लाए अल्लाह उसके दिल को राह दिखाएगा और अल्लाह सब कुछ जानता है।",
    "21:35 हर जान को मौत का मज़ा चखना है और हम तुम्हें आज़माते हैं बुराई और भलाई से परख़ने के लिए और हमारी तरफ तुम्हें लौटना है।",
    "3:139 और न हिम्मत हारो और न ग़म करो और तुम ही ग़ालिब आओगे अगर ईमान रखते हो।",
    "2:186 और जब मेरे बंदे तुमसे मेरी बाबत पूछें तो मैं नज़दीक हूँ। हर पुकारने वाले की दुआ सुनता हूँ जब वो मुझे पुकारे तो उन्हें भी चाहिए कि मेरी पुकार पर लब्बैक कहें और मुझ पर ईमान लाएँ कि शायद राह पर आ जाएँ।",
    "13:28 वो जो ईमान लाए और उनके दिलों को अल्लाह की याद से चैन मिलता है सुन लो अल्लाह की याद ही से दिल चैन पाते हैं।",
    "50:16 और हमने आदमी को पैदा किया और हम जानते हैं जो उसके दिल में गुज़रता है और हम उसकी तरफ उसकी रग-ए-जान से भी ज़्यादा क़रीब हैं।",
    "42:28 और वही है जो बारिश उतारता है उनके ना उम्मीद होने के बाद और अपनी रहमत फैलाता है और वही है वाली सब सराहे हुए।",
    "39:53 तुम फ़रमा दो ऐ मेरे बंदो जिन्होंने अपनी जानों पर ज़्यादती की है अल्लाह की रहमत से ना उम्मीद न हो। बेशक अल्लाह सब गुनाह बख़्श देता है। बेशक वो ही बख़्शने वाला मेहरबान है।",
    "16:97 जो कोई अच्छा काम करे मर्द हो या औरत और वो ईमान वाला हो तो ज़रूर हम उसे अच्छी ज़िंदगी जिलाएँगे और ज़रूर हम उन्हें उनका सवाब देंगे उनके सबसे अच्छे काम के बदले।",
    "10:25 और अल्लाह सलामती के घर (जन्नत) की तरफ बुलाता है और जिसे चाहे सीधी राह दिखाता है।",
    "18:88 और जिसने ईमान क़बूल किया और नेक काम किए तो उसकी बेहतरीन जज़ा है और अनक़रीब हम उसे अपने हुक्म में नरमी बताएँगे।",
    "29:69 और जिन्होंने हमारी राह में कोशिश की ज़रूर हम उन्हें अपनी राहें दिखा देंगे और बेशक अल्लाह नेकी करने वालों के साथ है।",
    "8:46 और अल्लाह और उसके रसूल का हुक्म मानो और आपस में न झगड़ो कि फिर हिम्मत हार दोगे और तुम्हारी हवा उखड़ जाएगी और सब्र करो, बेशक अल्लाह सब्र करने वालों के साथ है।",
    "3:146 और कितने ही नबी हुए जिनके साथ बहुत से अल्लाह वाले लड़े तो न हिम्मत हारी उससे जो उन्हें अल्लाह की राह में पहुँचा और न कमज़ोर पड़े और न दबे और अल्लाह सब्र करने वालों को दोस्त रखता है।",
    "12:87 ऐ मेरे बेटों जाओ यूसुफ़ और उसके भाई का पता लगाओ और अल्लाह की रहमत से ना उम्मीद न हो, बेशक अल्लाह की रहमत से वही ना उम्मीद होते हैं जो काफ़िर हैं।",
    "30:50 तो देखो अल्लाह की रहमत के आसार कैसे ज़मीन को ज़िंदा करता है उसके मरने के बाद। बेशक वो ही मुर्दों को ज़िंदा करने वाला है और वो हर चीज़ पर क़ादिर है।",
    "11:88 फ़रमाया ऐ मेरी क़ौम! भला बताओ तो अगर मैं अपने रब की तरफ से रौशन दलील पर हूँ और उसने मुझे अपने पास से अच्छा रिज़्क़ दिया, और मैं ये नहीं चाहता कि जिस बात से तुम्हें मना करूँ और आप उसके ख़िलाफ़ करूँ। मेरा इरादा तो सिर्फ सुधारना है जहाँ तक मुझसे हो सके, और मेरी तौफ़ीक़ नहीं मगर अल्लाह ही के फ़ज़ल से, मैंने उसी पर भरोसा किया और उसी की तरफ़ रुजू’ होता हूँ।",
    "12:18 और उसकी क़मीज़ पर झूटा ख़ून लगा लाए, कहा बल्कि तुम्हारे दिलों ने तुम्हारे लिए एक बात बना दी है तो अच्छा सब्र है और अल्लाह ही से मदद चाहता हूँ उस पर जो तुम बयान करते हो।",
    "90:4 बेशक हमने आदमी को तंगी में पैदा किया।",
    "46:35 तो सब्र करो जैसे सब्र किया हिम्मत वाले रसूलों ने और उनके लिए जल्दी न करो। गोया जब वो देखेंगे जिसका उनसे वादा होता है तो दुनिया में न रहे थे मगर दिन की एक घड़ी। ये पहुँचा देना है तो क्या हलाक किया जाए मगर नाफ़रमान लोग।",
    "2:214 क्या तुम ये गुमान करते हो कि जन्नत में चले जाओगे और अभी तुम पर अगलों की सी हालत न आई। उन्हें सख़्तियाँ और तकलीफ़ें पहुँचीं और हिला डाले गए यहाँ तक कि रसूल और उसके साथ के ईमान वाले कहने लगे अल्लाह की मदद कब आएगी। सुन लो बेशक अल्लाह की मदद क़रीब है।",
    "93:3-4 🔓 तुम्हारे रब ने तुम्हें न छोड़ा और न नाराज़ हुआ। (3) और बेशक अगली तुम्हारे लिए पिछली से बेहतर है। (4)",
    "25:74 और वो जो कहते हैं ऐ हमारे रब! हमें हमारी बीवियों और हमारी औलाद से आँखों की ठंडक अता कर और हमें परहेज़गारों का पेशवा बना।"
]


Hi_haram_tendency_verses = [
    "39:53 तुम फ़रमा दो ऐ मेरे बंदो जिन्होंने अपनी जानों पर ज़्यादती की है अल्लाह की रहमत से ना उम्मीद न हो। बेशक अल्लाह सब गुनाह बख़्श देता है। बेशक वो ही बख़्शने वाला मेहरबान है।",
    "4:110 और जो कोई बुराई करे या अपनी जान पर ज़ुल्म करे फिर अल्लाह से माफ़ी माँगे तो अल्लाह को बख़्शने वाला मेहरबान पाएगा।",
    "42:25 और वही है जो अपने बंदों की तौबा क़बूल करता है और बुराइयों से दरगुज़र करता है और जानता है जो कुछ तुम करते हो।",
    "5:39 तो जो अपने ज़ुल्म के बाद तौबा करे और सुधर जाए तो बेशक अल्लाह उसकी तौबा क़बूल करेगा। बेशक अल्लाह बख़्शने वाला मेहरबान है।",
    "3:135 और वो कि जब कोई बे हयाई का काम करें या अपनी जानों पर ज़ुल्म करें तो अल्लाह को याद करें और अपने गुनाहों की माफ़ी चाहें और गुनाह कौन बख़्शे सिवाए अल्लाह के? और अपने किए पर नाड़ न लें और वो जानते हों।",
    "65:2-3 🔓 फिर जब अपनी मुद्दत को पहुँच जाएँ तो उन्हें अच्छे तरीक़े से रोक लो या अच्छे तरीक़े से जुदा कर दो और अपने में से दो इंसाफ़ वाले को गवाह कर लो और गवाही अल्लाह के लिए क़ायम करो, ये उसकी नसीहत है जिसे अल्लाह और क़यामत पर ईमान हो और जो अल्लाह से डरे अल्लाह उसके लिए निज़ात की राह निकाल देगा। (2) और उसे रोज़ी देगा जहाँ से उसका गुमान भी न हो और जो अल्लाह पर भरोसा करे तो अल्लाह उसे काफी है। बेशक अल्लाह अपना काम पूरा करने वाला है। बेशक अल्लाह ने हर चीज़ का एक अंदाज़ा रखा है। (3)",
    "33:70-71 🔓 ऐ ईमान वालो! अल्लाह से डरो और सीधी बात कहो। (70) अल्लाह तुम्हारे काम संवार देगा और तुम्हारे गुनाह बख़्श देगा और जो अल्लाह और उसके रसूल का हुक्म माने उसने बड़ी कामयाबी पाई। (71)",
    "2:199 फिर जहाँ से और लोग पलटे हैं तुम भी वहीं से पलटो और अल्लाह से माफ़ी माँगो। बेशक अल्लाह बख़्शने वाला मेहरबान है।",
    "24:31 और ईमान वाली औरतों से कह दो अपनी निगाहें नीची रखें और अपनी शर्मगाहों की हिफ़ाज़त करें और अपना शृंगार ज़ाहिर न करें मगर जो उसमें से ज़ाहिर हो और अपनी ओढ़नियाँ अपने सीनों पर डालें रहें और अपना शृंगार ज़ाहिर न करें मगर अपने शौहरों पर या अपने बापों पर या अपने शौहरों के बापों पर या अपने बेटों पर या अपने शौहरों के बेटों पर या अपने भाइयों पर या अपने भाइयों के बेटों पर या अपनी बहनों के बेटों पर या अपनी औरतों पर या अपनी मिलकियत के दासियों पर या उन गुलामों पर जिन्हें कोई आरज़ू न हो औरतों की या उन बच्चों पर जो औरतों की छिपी बातों से वाक़िफ़ नहीं और अपने पाँव ज़मीन पर न मारें कि जाना जाए उनका छिपा हुआ ज़ेवर। और ऐ ईमान वालो! तुम सब अल्लाह की तरफ तौबा करो ताकि तुम फ़लाह पाओ।",
    "4:28 अल्लाह चाहता है कि तुम पर से बोझ हल्का करे और आदमी कमज़ोर पैदा किया गया है।",
    "2:286 अल्लाह किसी जान पर उसकी ताक़त से ज़्यादा बोझ नहीं डालता, उसके लिए है जो उसने कमाया और उस पर है जो उसने इख़्तियार किया। ऐ हमारे रब! अगर हम भूले या ख़ता की तो हमें न पकड़। ऐ हमारे रब! और हम पर वो बोझ न डाल जैसा तूने हमसे अगले लोगों पर डाला था। ऐ हमारे रब! और हम पर वो बोझ न डाल जिसकी हमें ताक़त न हो और हमसे दरगुज़र कर और हमें बख़्श दे और हम पर रहम कर। तू हमारा मालिक है तो हमें काफ़िरों पर मदद दे।",
    "16:97 जो कोई अच्छा काम करे मर्द हो या औरत और वो ईमान वाला हो तो ज़रूर हम उसे अच्छी ज़िंदगी जिलाएँगे और ज़रूर हम उन्हें उनका सवाब देंगे उनके सबसे अच्छे काम के बदले।",
    "29:69 और जिन्होंने हमारी राह में कोशिश की ज़रूर हम उन्हें अपनी राहें दिखा देंगे और बेशक अल्लाह नेकी करने वालों के साथ है।",
    "3:102 ऐ ईमान वालो! अल्लाह से डरो जैसा उससे डरने का हक़ है और हरगिज़ न मरना मगर मुसलमान मरना।",
    "3:103 और अल्लाह की रस्सी को सब मिलकर मज़बूती से पकड़ लो और फूट न डालो और अल्लाह का एहसान अपने ऊपर याद करो जब तुम आपस में दुश्मन थे तो उसने तुम्हारे दिलों में उल्फ़त डाल दी तो तुम उसके फ़ज़ल से भाई भाई हो गए और तुम आग के गड्ढे के किनारे पर थे तो उसने तुम्हें उससे बचा लिया। यूँ ही अल्लाह तुम्हारे लिए अपनी आयतें बयान करता है ताकि तुम राह पाओ।",
    "49:13 ऐ लोगो! हमने तुम्हें एक मर्द और एक औरत से पैदा किया और तुम्हें क़ौमें और क़बीले बनाया ताकि एक दूसरे को पहचानो। बेशक अल्लाह के नज़दीक तुम में ज़्यादा इज़्ज़त वाला वो है जो तुम में ज़्यादा परहेज़गार है। बेशक अल्लाह जानने वाला ख़बरदार।",
    "13:11 आदमी के लिए उसके आगे और पीछे फ़रिश्ते हैं अल्लाह के हुक्म से उसकी निगहबानी करते हैं। बेशक अल्लाह किसी क़ौम की हालत नहीं बदलता जब तक वो ख़ुद अपनी हालत न बदले और जब अल्लाह किसी क़ौम से बुराई का इरादा फ़रमाए तो वो हट नहीं सकती और अल्लाह के सिवा उनका कोई हिमायती नहीं।",
    "2:45 और सब्र और नमाज़ से मदद माँगो और बेशक नमाज़ ज़रूर भारी है मगर उन पर जो डर रखते हैं।",
    "66:8 ऐ ईमान वालो! अल्लाह की तरफ़ ऐसी तौबा करो जो ख़ालिस हो क़रीब है कि तुम्हारा रब तुम्हारी बुराइयाँ मिटा दे और तुम्हें ऐसे बाग़ों में दाख़िल करे जिनके नीचे नहरें बहती हैं जिस दिन अल्लाह रुसवा न करेगा नबी को और उनके साथ के ईमान वालों को। उनका नूर उनके आगे और उनके दाहनी तरफ़ दौड़ता होगा, कहेंगे ऐ हमारे रब! हमारा नूर पूरा कर दे और हमें बख़्श दे, बेशक तू हर चीज़ पर क़ादिर है।",
    "25:70 मगर जिसने तौबा की और ईमान लाया और अच्छा काम किया तो ऐसे लोगों की बुराइयाँ अल्लाह भलाईयों से बदल देगा और अल्लाह बख़्शने वाला मेहरबान है।",
    "7:156 और हमारे लिए लिख दे इस दुनिया में भलाई और आख़िरत में, बेशक हम तेरी तरफ़ रुजू’ हुए। फ़रमाया मेरा अज़ाब उसे पहुँचता है जिसे चाहूँ और मेरी रहमत हर चीज़ को घेरे हुए है तो अनक़रीब वो लिख दूँगा उन्हें जो डरते हैं और ज़कात देते हैं और जो हमारी आयतों पर ईमान लाते हैं।",
    "17:25 तुम्हारा रब खूब जानता है जो तुम्हारे दिलों में है, अगर तुम नेक हो तो बेशक वो तौबा करने वालों को बख़्शने वाला है।",
    "6:54 और जब तुम्हारे पास वो आएँ जो हमारी आयतों पर ईमान लाते हैं तो फ़रमाओ तुम पर सलामती हो, तुम्हारे रब ने अपने ऊपर रहमत लाज़िम कर ली है कि तुम में जो कोई नादानी से कोई बुराई करे फिर उसके बाद तौबा करे और सुधार ले तो बेशक अल्लाह बख़्शने वाला मेहरबान है।"
]


def hindi(request):
    return render(request, 'La_hindi.html')

def Hi_anxious(request):
    verse = random.choice(Hi_anxious_verses)
    return render(request, 'anxious.html', {'verse': verse})

def Hi_happy(request):
    verse = random.choice(Hi_happy_verses)
    return render(request, 'happy.html', {'verse': verse})

def Hi_thankful(request):
    verse = random.choice(Hi_thankful_verses)
    return render(request, 'thankful.html', {'verse': verse})

def Hi_lonely(request):
    verse = random.choice(Hi_lonely_verses)
    return render(request, 'lonely.html', {'verse': verse})

def Hi_angry(request):
    verse = random.choice(Hi_angry_verses)
    return render(request, 'angry.html', {'verse': verse})

def Hi_sad(request):
    verse = random.choice(Hi_sad_verses)
    return render(request, 'sad.html', {'verse': verse})

def Hi_haram_tendency(request):
    verse = random.choice(Hi_haram_tendency_verses)
    return render(request, 'haram_tendency.html', {'verse': verse})


#Indonesian
In_anxious_verses = [
    "3:54 🔓 Dan mereka (orang-orang kafir) membuat tipu daya, dan Allah membalas tipu daya mereka itu. Dan Allah sebaik-baik pembuat tipu daya.", 
    "8:30 🔓 Dan (ingatlah), ketika orang-orang kafir (Quraisy) berkomplot terhadapmu (Muhammad) untuk menangkap dan memenjarakanmu, atau membunuhmu, atau mengusirmu. Mereka membuat tipu daya dan Allah pun membuat tipu daya. Dan Allah sebaik-baik pembuat tipu daya.", 
    "13:28 🔓 (yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    "2:45 🔓 Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Dan (salat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk,",
    "94:5-6 🔓 Maka sesungguhnya bersama kesulitan ada kemudahan, (5) sesungguhnya bersama kesulitan ada kemudahan. (6)",
    "2:286 Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari (kebajikan) yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya. (Mereka berdoa), 'Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami tersalah. Ya Tuhan kami, janganlah Engkau bebankan kepada kami beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Ya Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tidak sanggup kami memikulnya. Beri maaf-lah kami; ampuni-lah kami; dan rahmatilah kami. Engkaulah Pelindung kami, maka tolonglah kami menghadapi orang-orang kafir.'",
    "64:11 Tidak ada suatu musibah pun yang menimpa (seseorang) kecuali dengan izin Allah. Dan barangsiapa beriman kepada Allah, niscaya Dia akan memberi petunjuk kepada hatinya. Dan Allah Maha Mengetahui segala sesuatu.",
    "65:3 dan memberinya rezeki dari arah yang tidak disangka-sangkanya. Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan-Nya. Sungguh, Allah telah mengadakan ketentuan bagi setiap sesuatu.",
    "20:46 Dia (Allah) berfirman, 'Janganlah kamu berdua khawatir, sesungguhnya Aku bersama kamu berdua, Aku mendengar dan melihat.'",
    "3:173 (Yaitu) orang-orang (sahabat) yang menaati Allah dan Rasul, yang ketika ada orang-orang berkata kepadanya, 'Sesungguhnya manusia (musuh) telah mengumpulkan pasukan untuk menyerang kamu, karena itu takutlah kepada mereka,' ternyata (ucapan) itu menambah keimanan mereka dan mereka menjawab, 'Cukuplah Allah (menjadi penolong) bagi kami dan Dia sebaik-baik pelindung.'",
    "9:40 Jika kamu tidak menolongnya (Muhammad), maka sungguh, Allah telah menolongnya, (yaitu) ketika orang-orang kafir mengusirnya (dari Mekah), sedang dia salah seorang dari dua orang ketika keduanya berada dalam gua, ketika dia berkata kepada sahabatnya (Abu Bakar), 'Jangan engkau bersedih, sesungguhnya Allah bersama kita.' Maka Allah menurunkan ketenangan kepadanya (Muhammad) dan membantu dengan bala tentara (malaikat-malaikat) yang tidak terlihat olehmu, dan Dia menjadikan seruan orang-orang kafir itu seruan yang paling rendah. Dan firman Allah itulah yang tinggi. Allah Mahaperkasa, Mahabijaksana.",
    "4:81 Dan mereka (orang-orang munafik) berkata, 'Kami taat.' Tetapi apabila mereka telah keluar dari sisimu (Muhammad), sebagian dari mereka mengatur siasat di malam hari (berbeda) dari apa yang engkau katakan. Allah mencatat siasat yang mereka atur di malam hari itu, maka berpalinglah dari mereka dan bertawakallah kepada Allah. Cukuplah Allah menjadi pelindung.",
    "9:51 Katakanlah (Muhammad), 'Tidak akan menimpa kami melainkan apa yang telah ditetapkan Allah bagi kami. Dialah pelindung kami, dan hanya kepada Allah hendaknya orang-orang mukmin bertawakal.'",
    "50:16 Dan sungguh, Kami telah menciptakan manusia dan mengetahui apa yang dibisikkan oleh hatinya, dan Kami lebih dekat kepadanya daripada urat lehernya.",
    "42:28 Dan Dialah yang menurunkan hujan setelah mereka berputus asa dan menyebarkan rahmat-Nya. Dan Dialah Maha Pelindung, Maha Terpuji.",
    "3:159 Maka berkat rahmat Allah engkau (Muhammad) berlaku lemah lembut terhadap mereka. Sekiranya engkau bersikap keras dan berhati kasar, tentulah mereka menjauhkan diri dari sekitarmu. Karena itu maafkanlah mereka dan mohonkanlah ampunan untuk mereka, dan bermusyawarahlah dengan mereka dalam urusan itu. Kemudian apabila engkau telah membulatkan tekad, maka bertawakallah kepada Allah. Sungguh, Allah mencintai orang yang bertawakal.",
    "33:3 dan bertawakallah kepada Allah. Cukuplah Allah sebagai pemelihara.",
    "12:64 Dia (Ya'qub) berkata, 'Bagaimana aku akan mempercayakan dia (Bunyamin) kepadamu, kecuali seperti aku telah mempercayakan saudaranya (Yusuf) kepada kamu dahulu?' Maka Allah adalah penjaga yang terbaik, dan Dia Maha Penyayang di antara para penyayang.",
    "2:216 Diwajibkan atas kamu berperang, padahal itu tidak menyenangkan bagimu. Tetapi boleh jadi kamu tidak menyenangi sesuatu, padahal itu baik bagimu, dan boleh jadi kamu menyukai sesuatu, padahal itu tidak baik bagimu. Allah mengetahui, sedang kamu tidak mengetahui.",
    "3:139 Dan janganlah kamu berhati lemah, dan jangan (pula) bersedih hati, sebab kamu paling tinggi (derajatnya) jika kamu orang beriman.",
    "16:127 Dan bersabarlah (Muhammad) dan kesabaranmu itu semata-mata dengan pertolongan Allah, dan janganlah engkau bersedih hati terhadap (kekafiran) mereka dan jangan (pula) bersempit dada terhadap tipu daya yang mereka rencanakan.",
    "29:2-3 Apakah manusia mengira bahwa mereka akan dibiarkan hanya dengan mengatakan, 'Kami telah beriman,' dan mereka tidak diuji? (2) Dan sungguh, Kami telah menguji orang-orang sebelum mereka, maka Allah pasti mengetahui orang-orang yang benar dan pasti mengetahui orang-orang yang dusta. (3)",
    "23:115 Maka apakah kamu mengira bahwa Kami menciptakan kamu main-main (tanpa ada maksud) dan bahwa kamu tidak akan dikembalikan kepada Kami?",
    "67:2 Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Mahaperkasa, Maha Pengampun.",
    "2:214 Atau apakah kamu mengira bahwa kamu akan masuk surga, padahal belum datang kepadamu (cobaan) seperti (yang dialami) orang-orang terdahulu sebelum kamu. Mereka ditimpa kemiskinan dan penderitaan, dan diguncang (dengan berbagai cobaan), sehingga Rasul dan orang-orang yang beriman bersamanya berkata, 'Kapankah datang pertolongan Allah?' Ingatlah, sesungguhnya pertolongan Allah itu dekat.",
    "2:155-156 🔓 Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar, (155) (yaitu) orang-orang yang apabila ditimpa musibah, mereka berkata 'Inna lillahi wa inna ilaihi raji'un' (Sesungguhnya kami milik Allah dan kepada-Nyalah kami kembali). (156)",
    "2:153 Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.",
    "7:200 Dan jika setan datang menggodamu dengan suatu godaan, maka mohonlah perlindungan kepada Allah. Sungguh, Dia Maha Mendengar, Maha Mengetahui.",
    "4:58 Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkannya dengan adil. Sungguh, Allah sebaik-baik yang memberi pengajaran kepadamu. Sungguh, Allah Maha Mendengar, Maha Melihat.",
    "17:110 Katakanlah (Muhammad), 'Serulah Allah atau serulah Ar-Rahman. Dengan nama yang mana saja kamu menyeru, Dia mempunyai asmaul husna (nama-nama yang terbaik) dan janganlah engkau mengeraskan suaramu dalam salat dan janganlah (pula) merendahkannya dan carilah jalan tengah di antara itu.'"
]

In_happy_verses = [
    "10:58 Katakanlah (Muhammad), 'Dengan karunia Allah dan rahmat-Nya, hendaklah dengan itu mereka bergembira. Itu lebih baik dari apa yang mereka kumpulkan.'", 
    "16:97 Barangsiapa mengerjakan kebajikan, baik laki-laki maupun perempuan dalam keadaan beriman, maka pasti akan Kami berikan kepadanya kehidupan yang baik dan pasti akan Kami beri balasan dengan pahala yang lebih baik dari apa yang telah mereka kerjakan.", 
    "16:78 Dan Allah mengeluarkan kamu dari perut ibumu dalam keadaan tidak mengetahui sesuatu pun, dan Dia memberimu pendengaran, penglihatan, dan hati nurani, agar kamu bersyukur.",
    "16:10-11 Dialah yang telah menurunkan air dari langit untuk kamu, sebagiannya menjadi minuman dan sebagiannya (menyuburkan) tumbuhan, padanya kamu menggembalakan ternakmu. (10) Dia menumbuhkan untukmu dengan air itu tanam-tanaman; zaitun, kurma, anggur, dan segala macam buah-buahan. Sungguh, pada yang demikian itu benar-benar terdapat tanda (kebesaran Allah) bagi orang yang berpikir. (11)",
    "16:80 Dan Allah menjadikan bagimu rumah-rumahmu sebagai tempat tinggal, dan Dia menjadikan bagimu dari kulit binatang ternak rumah-rumah (kemah) yang kamu merasa ringan (membawa)nya pada waktu kamu bepergian dan pada waktu kamu bermukim, dan (dijadikan-Nya pula) dari bulu domba, bulu unta, dan bulu kambing, alat-alat rumah tangga dan perhiasan (yang kamu pakai) sampai waktu (tertentu).",
    "2:186 Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku Kabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku. Hendaklah mereka itu memenuhi (perintah)-Ku dan beriman kepada-Ku, agar mereka memperoleh kebenaran.",
    "16:53 Dan segala nikmat yang ada padamu (datangnya) dari Allah, kemudian apabila kamu ditimpa kesengsaraan, maka kepada-Nyalah kamu meminta pertolongan.",
    "16:18 Dan jika kamu menghitung nikmat Allah, niscaya kamu tidak akan mampu menghitungnya. Sungguh, Allah Maha Pengampun, Maha Penyayang.",
    "16:81 Dan Allah menjadikan bagimu tempat bernaung dari apa yang telah Dia ciptakan, dan Dia menjadikan bagimu tempat-tempat tinggal di gunung-gunung, dan Dia menjadikan bagimu pakaian yang memeliharamu dari panas dan pakaian (baju besi) yang memeliharamu dalam peperangan. Demikianlah Allah menyempurnakan nikmat-Nya kepadamu agar kamu berserah diri (kepada-Nya).",
    "21:35 Setiap yang bernyawa akan merasakan mati. Kami akan menguji kamu dengan keburukan dan kebaikan sebagai cobaan. Dan kamu akan dikembalikan hanya kepada Kami.",
    "2:25 Dan sampaikanlah kabar gembira kepada orang-orang yang beriman dan berbuat kebajikan, bahwa untuk mereka (disediakan) surga-surga yang mengalir di bawahnya sungai-sungai. Setiap kali mereka diberi rezeki buah-buahan dari surga, mereka berkata, 'Inilah rezeki yang diberikan kepada kami dahulu.' Mereka telah diberi (buah-buahan) yang serupa, dan di sana mereka memperoleh pasangan-pasangan yang suci, dan mereka kekal di dalamnya.",
    "18:88 Dan adapun orang yang beriman dan mengerjakan kebajikan, maka dia akan mendapat balasan yang terbaik sebagai tempat kembali, dan akan kami katakan kepadanya (perintah kami) yang mudah-mudah.",
    "10:25 Dan Allah menyeru (manusia) ke Darussalam (surga), dan Dia memberi petunjuk kepada orang yang Dia kehendaki ke jalan yang lurus.",
    "39:53 Katakanlah (Muhammad), 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya. Sungguh, Dialah Yang Maha Pengampun, Maha Penyayang.'",
    "25:70 Kecuali orang-orang yang bertobat, beriman dan mengerjakan kebajikan; maka kejahatan mereka diganti Allah dengan kebaikan. Allah Maha Pengampun, Maha Penyayang.",
    "103:1-3 🔓 Demi masa, (1) sungguh, manusia berada dalam kerugian, (2) kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran. (3)",
    "4:69 Dan barangsiapa menaati Allah dan Rasul (Muhammad), maka mereka itu akan bersama-sama dengan orang yang diberikan nikmat oleh Allah, (yaitu) para nabi, para pencinta kebenaran, orang-orang yang mati syahid, dan orang-orang saleh. Mereka itulah teman yang sebaik-baiknya.",
    "9:21 Tuhan mereka menggembirakan mereka dengan rahmat dari-Nya, keridaan, dan surga-surga. Bagi mereka di dalamnya ada kenikmatan yang kekal.",
    "13:29 Orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    "32:17 Maka tidak seorang pun mengetahui apa yang disembunyikan untuk mereka (bermacam-macam nikmat) yang menyenangkan pandangan mata, sebagai balasan terhadap apa yang telah mereka kerjakan.",
    "36:55 Sungguh, penghuni surga pada hari itu bersenang-senang dalam kesibukan (mereka).",
    "43:70 Masuklah kamu ke surga bersama pasangan-pasanganmu, dalam keadaan bergembira ria.",
    "76:11 Maka Allah melindungi mereka dari kejahatan hari itu, dan memberikan kepada mereka kecerahan wajah dan kegembiraan.",
    "89:27-30 🔓 Wahai jiwa yang tenang! (27) Kembalilah kepada Tuhanmu dengan hati yang rida dan diridai-Nya. (28) Maka masuklah ke dalam golongan hamba-hamba-Ku, (29) dan masuklah ke dalam surga-Ku. (30)",
    "48:4 Dialah yang telah menurunkan ketenangan ke dalam hati orang-orang mukmin untuk menambah keimanan atas keimanan mereka (yang telah ada). Dan milik Allah-lah bala tentara langit dan bumi, dan Allah Maha Mengetahui, Mahabijaksana.",
    "24:35 Allah (Pemberi) cahaya (kepada) langit dan bumi. Perumpamaan cahaya-Nya, seperti sebuah lubang (di dinding) yang tidak tembus, yang di dalamnya ada pelita besar. Pelita itu di dalam tabung kaca (dan) tabung kaca itu bagaikan bintang yang berkilauan, yang dinyalakan dengan minyak dari pohon yang diberkahi, (yaitu) pohon zaitun yang tidak di timur dan tidak pula di barat, yang minyaknya (saja) hampir-hampir menerangi, walaupun tidak disentuh api. Cahaya di atas cahaya (berlapis-lapis), Allah membimbing siapa yang Dia kehendaki kepada cahaya-Nya, dan Allah membuat perumpamaan-perumpamaan bagi manusia. Dan Allah Maha Mengetahui segala sesuatu.",
    "55:60 Tidak ada balasan untuk kebaikan selain kebaikan (pula).",
    "41:30 Sesungguhnya orang-orang yang berkata, 'Tuhan kami adalah Allah' kemudian mereka meneguhkan pendirian mereka, maka malaikat-malaikat akan turun kepada mereka (dengan berkata), 'Janganlah kamu merasa takut dan janganlah kamu bersedih hati; dan bergembiralah kamu dengan surga yang telah dijanjikan kepadamu.'"
]

In_thankful_verses = [
    "14:7 Dan (ingatlah) ketika Tuhanmu memaklumkan, 'Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu, tetapi jika kamu mengingkari (nikmat-Ku), maka pasti azab-Ku sangat berat.'",
    "16:78 Dan Allah mengeluarkan kamu dari perut ibumu dalam keadaan tidak mengetahui sesuatu pun, dan Dia memberimu pendengaran, penglihatan, dan hati nurani, agar kamu bersyukur.",
    "2:152 Maka ingatlah Aku, niscaya Aku akan mengingatmu. Bersyukurlah kepada-Ku dan janganlah ingkar (kepada-Ku).",
    "2:172 Wahai orang-orang yang beriman! Makanlah dari rezeki yang baik-baik yang Kami berikan kepadamu dan bersyukurlah kepada Allah, jika kamu hanya menyembah kepada-Nya.",
    "27:40 Seorang yang mempunyai ilmu dari Kitab berkata, 'Aku akan membawanya kepadamu sebelum matamu berkedip.' Maka ketika dia (Sulaiman) melihat singgasana itu terletak di hadapannya, dia pun berkata, 'Ini termasuk karunia Tuhanku untuk mengujiku, apakah aku bersyukur atau mengingkari (nikmat-Nya). Barangsiapa bersyukur, maka sesungguhnya dia bersyukur untuk (kebaikan) dirinya sendiri, dan barangsiapa ingkar, maka sesungguhnya Tuhanku Mahakaya, Mahamulia.'",
    "31:12 Dan sungguh, telah Kami berikan hikmah kepada Luqman, yaitu, 'Bersyukurlah kepada Allah! Dan barangsiapa bersyukur (kepada Allah), maka sesungguhnya dia bersyukur untuk dirinya sendiri; dan barangsiapa tidak bersyukur (kufur), maka sesungguhnya Allah Mahakaya, Maha Terpuji.'",
    "16:53 Dan segala nikmat yang ada padamu (datangnya) dari Allah, kemudian apabila kamu ditimpa kesengsaraan, maka kepada-Nyalah kamu meminta pertolongan.",
    "14:34 Dan Dia telah memberikan kepadamu segala apa yang kamu mohonkan kepada-Nya. Dan jika kamu menghitung nikmat Allah, niscaya kamu tidak akan mampu menghitungnya. Sungguh, manusia itu sangat zalim dan sangat mengingkari (nikmat Allah).",
    "34:13 Mereka (para jin itu) bekerja untuk Sulaiman sesuai dengan apa yang dikehendakinya, di antaranya (membuat) gedung-gedung yang tinggi, patung-patung, piring-piring yang (besarnya) seperti kolam dan periuk-periuk yang tetap (berada di atas tungku). Bekerjalah wahai keluarga Daud untuk bersyukur (kepada Allah). Dan sedikit sekali dari hamba-hamba-Ku yang bersyukur.",
    "3:145 Dan setiap yang bernyawa tidak akan mati kecuali dengan izin Allah, sebagai ketetapan yang telah ditentukan waktunya. Barangsiapa menghendaki pahala dunia, niscaya Kami berikan kepadanya sebagian dari (pahala) dunia itu; dan barangsiapa menghendaki pahala akhirat, Kami berikan (pula) kepadanya (pahala) itu. Dan Kami akan memberi balasan kepada orang-orang yang bersyukur.",
    "16:81 Dan Allah menjadikan bagimu tempat bernaung dari apa yang telah Dia ciptakan, dan Dia menjadikan bagimu tempat-tempat tinggal di gunung-gunung, dan Dia menjadikan bagimu pakaian yang memeliharamu dari panas dan pakaian (baju besi) yang memeliharamu dalam peperangan. Demikianlah Allah menyempurnakan nikmat-Nya kepadamu agar kamu berserah diri (kepada-Nya).",
    "27:73 Dan sungguh, Tuhanmu benar-benar memiliki karunia (yang dilimpahkan) kepada manusia, tetapi kebanyakan mereka tidak bersyukur.",
    "55:13 Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
    "17:3 (yaitu) keturunan orang yang Kami bawa bersama Nuh. Sungguh, dia (Nuh) adalah hamba (Allah) yang banyak bersyukur.",
    "76:9 'Sesungguhnya kami memberi makanan kepadamu hanyalah karena mengharapkan keridaan Allah, kami tidak menghendaki balasan dan terima kasih dari kamu.'",
    "2:243 Tidakkah kamu memperhatikan orang-orang yang keluar dari kampung halamannya dalam jumlah ribuan karena takut mati? Lalu Allah berfirman kepada mereka, 'Matilah kamu!' Kemudian Allah menghidupkan mereka. Sungguh, Allah memiliki karunia terhadap manusia, tetapi kebanyakan manusia tidak bersyukur.",
    "8:26 Dan ingatlah ketika kamu (para Muhajirin) masih sedikit, lemah, dan selalu takut orang-orang (kafir Mekah) akan menculik kamu, lalu Dia (Allah) memberi kamu tempat menetap (di Madinah) dan memperkuat kamu dengan pertolongan-Nya dan memberimu rezeki dari yang baik-baik agar kamu bersyukur.",
    "35:3 Wahai manusia! Ingatlah nikmat Allah kepadamu. Adakah pencipta selain Allah yang dapat memberikan rezeki kepadamu dari langit dan bumi? Tidak ada tuhan selain Dia; maka mengapa kamu berpaling (dari kebenaran)?",
    "16:114 Maka makanlah yang halal lagi baik dari rezeki yang telah diberikan Allah kepadamu; dan syukuri nikmat Allah, jika kamu hanya menyembah kepada-Nya.",
    "29:17 Sesungguhnya yang kamu sembah selain Allah hanyalah berhala-berhala, dan kamu membuat kebohongan. Sesungguhnya apa yang kamu sembah selain Allah itu tidak mampu memberikan rezeki kepadamu; maka mintalah rezeki dari Allah, dan sembahlah Dia serta bersyukurlah kepada-Nya. Hanya kepada-Nya kamu akan dikembalikan.",
    "7:10 Dan sungguh, Kami telah menempatkan kamu di bumi dan di sana Kami sediakan (sumber) penghidupan untukmu. (Tetapi) sedikit sekali kamu bersyukur.",
    "6:63 Katakanlah (Muhammad), 'Siapakah yang dapat menyelamatkan kamu dari bencana di darat dan di laut, (yaitu) ketika kamu berdoa kepada-Nya dengan rendah hati dan dengan suara yang lembut (dengan mengatakan), 'Sekiranya Dia menyelamatkan kami dari (bencana) ini, tentulah kami menjadi orang-orang yang bersyukur.''",
    "14:5 Dan sungguh, Kami telah mengutus Musa dengan membawa mukjizat-mukjizat Kami (dan Kami perintahkan kepadanya), 'Keluarkanlah kaummu dari kegelapan kepada cahaya terang-benderang dan ingatkanlah mereka kepada hari-hari Allah.' Sungguh, pada yang demikian itu terdapat tanda-tanda (kekuasaan Allah) bagi setiap orang yang sabar dan banyak bersyukur.",
    "54:35 sebagai nikmat dari Kami. Demikianlah Kami memberi balasan kepada orang-orang yang bersyukur.",
    "17:19 Dan barangsiapa menghendaki kehidupan akhirat dan berusaha ke arah itu dengan sungguh-sungguh, sedang dia beriman, maka mereka itulah orang yang usahanya dibalas dengan baik."
]

In_lonely_verses = [
    "50:16 Dan sungguh, Kami telah menciptakan manusia dan mengetahui apa yang dibisikkan oleh hatinya, dan Kami lebih dekat kepadanya daripada urat lehernya.",
    "2:186 Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku Kabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku. Hendaklah mereka itu memenuhi (perintah)-Ku dan beriman kepada-Ku, agar mereka memperoleh kebenaran.",
    "57:4 Dialah yang menciptakan langit dan bumi dalam enam masa, kemudian Dia bersemayam di atas ‘Arsy. Dia mengetahui apa yang masuk ke dalam bumi dan apa yang keluar dari dalamnya, dan apa yang turun dari langit dan apa yang naik ke sana. Dan Dia bersama kamu di mana saja kamu berada. Dan Allah Maha Melihat apa yang kamu kerjakan.",
    "20:46 Dia (Allah) berfirman, 'Janganlah kamu berdua khawatir, sesungguhnya Aku bersama kamu berdua, Aku mendengar dan melihat.'",
    "4:81 Dan mereka (orang-orang munafik) berkata, 'Kami taat.' Tetapi apabila mereka telah keluar dari sisimu (Muhammad), sebagian dari mereka mengatur siasat di malam hari (berbeda) dari apa yang engkau katakan. Allah mencatat siasat yang mereka atur di malam hari itu, maka berpalinglah dari mereka dan bertawakallah kepada Allah. Cukuplah Allah menjadi pelindung.",
    "19:96 Sungguh, orang-orang yang beriman dan beramal saleh, kelak Allah Yang Maha Pengasih akan menanamkan rasa kasih sayang (dalam hati mereka).",
    "33:41-42 Wahai orang-orang yang beriman! Ingatlah Allah dengan zikir yang banyak, (41) dan bertasbihlah kepada-Nya pada waktu pagi dan petang. (42)",
    "2:45 Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Dan (salat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk,",
    "65:3 dan memberinya rezeki dari arah yang tidak disangka-sangkanya. Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan-Nya. Sungguh, Allah telah mengadakan ketentuan bagi setiap sesuatu.",
    "11:123 Dan milik Allahlah segala yang gaib di langit dan di bumi dan hanya kepada-Nya segala urusan dikembalikan. Maka sembahlah Dia dan bertawakallah kepada-Nya. Dan Tuhanmu tidak akan lengah terhadap apa yang kamu kerjakan.",
    "10:25 Dan Allah menyeru (manusia) ke Darussalam (surga), dan Dia memberi petunjuk kepada orang yang Dia kehendaki ke jalan yang lurus.",
    "29:69 Dan orang-orang yang berjihad untuk (mencari keridaan) Kami, pasti akan Kami tunjukkan kepada mereka jalan-jalan Kami. Dan sungguh, Allah beserta orang-orang yang berbuat baik.",
    "13:28 (yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    "2:257 Allah Pelindung orang yang beriman. Dia mengeluarkan mereka dari kegelapan kepada cahaya (iman). Dan orang-orang yang kafir, pelindung-pelindung mereka adalah setan, yang mengeluarkan mereka dari cahaya kepada kegelapan (kekafiran). Mereka itu adalah penghuni neraka. Mereka kekal di dalamnya.",
    "58:7 Tidakkah engkau memperhatikan bahwa Allah mengetahui apa yang ada di langit dan apa yang ada di bumi? Tidak ada pembicaraan rahasia antara tiga orang, melainkan Dialah yang keempatnya. Dan tidak ada antara lima orang, melainkan Dialah yang keenamnya. Dan tidak (pula) kurang dari itu atau lebih banyak, melainkan Dia pasti bersama mereka di manapun mereka berada. Kemudian Dia akan memberitakan kepada mereka pada hari Kiamat apa yang telah mereka kerjakan. Sungguh, Allah Maha Mengetahui segala sesuatu.",
    "24:35 Allah (Pemberi) cahaya (kepada) langit dan bumi. Perumpamaan cahaya-Nya, seperti sebuah lubang (di dinding) yang tidak tembus, yang di dalamnya ada pelita besar. Pelita itu di dalam tabung kaca (dan) tabung kaca itu bagaikan bintang yang berkilauan, yang dinyalakan dengan minyak dari pohon yang diberkahi, (yaitu) pohon zaitun yang tidak di timur dan tidak pula di barat, yang minyaknya (saja) hampir-hampir menerangi, walaupun tidak disentuh api. Cahaya di atas cahaya (berlapis-lapis), Allah membimbing siapa yang Dia kehendaki kepada cahaya-Nya, dan Allah membuat perumpamaan-perumpamaan bagi manusia. Dan Allah Maha Mengetahui segala sesuatu.",
    "94:1-4 🔓 Bukankah Kami telah melapangkan dadamu (Muhammad)? (1) dan Kami pun telah menurunkan bebanmu darimu, (2) yang memberatkan punggungmu, (3) dan Kami tinggikan sebutan (nama)mu bagimu. (4)",
    "23:60 Dan orang-orang yang memberikan apa yang mereka berikan (dengan ikhlas), sedang hati mereka takut (akan diazab), karena sesungguhnya mereka akan kembali kepada Tuhan mereka,",
    "2:153 Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.",
    "4:108 Mereka bersembunyi dari manusia, tetapi tidak bersembunyi dari Allah, padahal Allah beserta mereka, ketika pada suatu malam mereka merencanakan sesuatu yang tidak diridai-Nya. Allah Maha Meliputi apa yang mereka kerjakan.",
    "4:147 Mengapa Allah akan menyiksamu, jika kamu bersyukur dan beriman? Padahal Allah Maha Mensyukuri, Maha Mengetahui.",
    "2:62 Sungguh, orang-orang yang beriman, orang-orang Yahudi, orang-orang Nasrani, dan orang-orang Sabi’in, siapa saja di antara mereka yang beriman kepada Allah dan hari Akhir, dan melakukan kebajikan, mereka mendapat pahala dari Tuhannya, tidak ada rasa takut pada mereka, dan mereka tidak bersedih hati.",
    "94:7-8 🔓 Maka apabila engkau telah selesai (dari sesuatu urusan), tetaplah bekerja keras (untuk urusan yang lain), (7) dan hanya kepada Tuhanmulah hendaknya engkau berharap. (8)"
]

In_angry_verses = [
    "42:40 Balasan suatu kejahatan adalah kejahatan yang setimpal, tetapi barangsiapa memaafkan dan berbuat baik (kepada orang yang berbuat jahat), maka pahalanya dari Allah. Sungguh, Dia tidak menyukai orang-orang zalim.",
    "42:37 Dan (bagi) orang-orang yang menjauhi dosa-dosa besar dan perbuatan-perbuatan keji, dan apabila mereka marah segera memberi maaf.",
    "3:134 (yaitu) orang-orang yang menafkahkan (hartanya), baik di waktu lapang maupun sempit, dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang lain. Allah menyukai orang-orang yang berbuat kebajikan.",
    "7:199 Jadilah engkau pemaaf, dan suruhlah orang mengerjakan yang makruf, serta berpalinglah dari orang-orang yang bodoh.",
    "41:34 Dan tidaklah sama kebaikan dengan kejahatan. Tolaklah (kejahatan itu) dengan cara yang lebih baik, sehingga orang yang ada rasa permusuhan antara kamu dan dia akan seperti teman yang sangat setia.",
    "42:43 Tetapi barangsiapa bersabar dan memaafkan, sungguh yang demikian itu termasuk perbuatan yang mulia.",
    "25:63 Adapun hamba-hamba Tuhan Yang Maha Pengasih itu adalah orang-orang yang berjalan di bumi dengan rendah hati dan apabila orang-orang bodoh menyapa mereka (dengan kata-kata yang menghina), mereka mengucapkan, 'Salam,'",
    "28:55 Dan apabila mereka mendengar perkataan yang tidak (bermanfaat), mereka berpaling darinya dan berkata, 'Bagi kami amal-amal kami dan bagimu amal-amalmu, salamun 'alaikum (semoga keselamatan tercurah atas kamu), kami tidak ingin bergaul dengan orang-orang bodoh.'",
    "65:3 dan memberinya rezeki dari arah yang tidak disangka-sangkanya. Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan-Nya. Sungguh, Allah telah mengadakan ketentuan bagi setiap sesuatu.",
    "16:127 Dan bersabarlah (Muhammad) dan kesabaranmu itu semata-mata dengan pertolongan Allah, dan janganlah engkau bersedih hati terhadap (kekafiran) mereka dan jangan (pula) bersempit dada terhadap tipu daya yang mereka rencanakan.",
    "70:5 Maka bersabarlah engkau (Muhammad) dengan kesabaran yang baik.",
    "74:7 dan untuk (memenuhi perintah) Tuhanmu, bersabarlah.",
    "29:69 Dan orang-orang yang berjihad untuk (mencari keridaan) Kami, pasti akan Kami tunjukkan kepada mereka jalan-jalan Kami. Dan sungguh, Allah beserta orang-orang yang berbuat baik.",
    "2:45 Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Dan (salat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk,",
    "2:155-156 🔓 Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar, (155) (yaitu) orang-orang yang apabila ditimpa musibah, mereka berkata 'Inna lillahi wa inna ilaihi raji'un' (Sesungguhnya kami milik Allah dan kepada-Nyalah kami kembali). (156)",
    "94:5-6 Maka sesungguhnya bersama kesulitan ada kemudahan, (5) sesungguhnya bersama kesulitan ada kemudahan. (6)",
    "16:126 Dan jika kamu membalas, maka balaslah dengan (balasan) yang sama dengan siksaan yang ditimpakan kepadamu. Tetapi jika kamu bersabar, sesungguhnya itulah yang lebih baik bagi orang yang sabar.",
    "39:10 Katakanlah (Muhammad), 'Wahai hamba-hamba-Ku yang beriman! Bertakwalah kepada Tuhanmu.' Bagi orang-orang yang berbuat baik di dunia ini akan memperoleh kebaikan. Dan bumi Allah itu luas. Hanya orang-orang yang bersabarlah yang disempurnakan pahalanya tanpa batas.",
    "5:13 Maka (disebabkan) pelanggaran mereka terhadap janji itu, Kami kutuk mereka, dan Kami jadikan hati mereka keras membatu. Mereka suka mengubah firman (Allah) dari tempat-tempatnya, dan mereka (sengaja) melupakan sebagian dari apa yang diperingatkan kepada mereka. Dan engkau (Muhammad) senantiasa akan melihat kekhianatan dari mereka kecuali sekelompok kecil di antara mereka. Maka maafkanlah mereka dan biarkanlah mereka. Sungguh, Allah menyukai orang-orang yang berbuat kebaikan.",
    "24:22 Dan janganlah orang-orang yang mempunyai kelebihan dan kelapangan di antara kamu bersumpah tidak akan memberi (bantuan) kepada kerabat(nya), orang-orang miskin dan orang-orang yang berhijrah di jalan Allah. Hendaklah mereka memaafkan dan berlapang dada. Apakah kamu tidak suka bahwa Allah mengampunimu? Dan Allah Maha Pengampun, Maha Penyayang.",
    "45:14 Katakanlah (Muhammad) kepada orang-orang yang beriman hendaklah mereka memaafkan orang-orang yang tidak takut akan hari-hari Allah, karena Dia akan membalas suatu kaum sesuai dengan apa yang telah mereka kerjakan.",
    "64:14 Wahai orang-orang yang beriman! Sesungguhnya di antara isteri-isterimu dan anak-anakmu ada yang menjadi musuh bagimu, maka berhati-hatilah kamu terhadap mereka; dan jika kamu memaafkan dan tidak memarahi serta mengampuni (mereka), maka sungguh, Allah Maha Pengampun, Maha Penyayang.",
    "15:85 Dan tidaklah Kami menciptakan langit dan bumi dan apa yang ada di antara keduanya melainkan dengan benar. Dan sesungguhnya hari Kiamat itu pasti akan datang, maka maafkanlah (mereka) dengan cara yang baik.",
    "3:159 Maka berkat rahmat Allah engkau (Muhammad) berlaku lemah lembut terhadap mereka. Sekiranya engkau bersikap keras dan berhati kasar, tentulah mereka menjauhkan diri dari sekitarmu. Karena itu maafkanlah mereka dan mohonkanlah ampunan untuk mereka, dan bermusyawarahlah dengan mereka dalam urusan itu. Kemudian apabila engkau telah membulatkan tekad, maka bertawakallah kepada Allah. Sungguh, Allah mencintai orang yang bertawakal.",
    "17:53 Dan katakanlah kepada hamba-hamba-Ku, 'Hendaklah mereka mengucapkan perkataan yang lebih baik.' Sungguh, setan itu selalu menimbulkan perselisihan di antara mereka. Sungguh, setan adalah musuh yang nyata bagi manusia."
]

In_sad_verses = [
    "2:155-156 🔓 Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar, (155) (yaitu) orang-orang yang apabila ditimpa musibah, mereka berkata 'Inna lillahi wa inna ilaihi raji'un' (Sesungguhnya kami milik Allah dan kepada-Nyalah kami kembali). (156)",
    "94:5-6 🔓 Maka sesungguhnya bersama kesulitan ada kemudahan, (5) sesungguhnya bersama kesulitan ada kemudahan. (6)",
    "2:286 Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari (kebajikan) yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya. (Mereka berdoa): 'Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami tersalah. Ya Tuhan kami, janganlah Engkau bebankan kepada kami beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Ya Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tak sanggup kami memikulnya. Beri maaflah kami; ampunilah kami; dan rahmatilah kami. Engkaulah Pelindung kami, maka tolonglah kami terhadap kaum yang kafir.'",
    "65:3 dan memberinya rezeki dari arah yang tidak disangka-sangkanya. Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan-Nya. Sungguh, Allah telah mengadakan ketentuan bagi setiap sesuatu.",
    "64:11 Tidak ada suatu musibah pun yang menimpa (seseorang) kecuali dengan izin Allah; dan barangsiapa beriman kepada Allah, niscaya Dia akan memberi petunjuk kepada hatinya. Dan Allah Maha Mengetahui segala sesuatu.",
    "21:35 Setiap yang bernyawa akan merasakan mati. Kami akan menguji kamu dengan keburukan dan kebaikan sebagai cobaan. Dan kamu hanya kepada Kami-lah dikembalikan.",
    "3:139 Janganlah kamu (merasa) lemah, dan jangan (pula) bersedih hati, sebab kamu paling tinggi (derajatnya) jika kamu orang beriman.",
    "2:186 Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku Kabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku. Hendaklah mereka itu memenuhi (perintah)-Ku dan beriman kepada-Ku, agar mereka memperoleh kebenaran.",
    "13:28 (yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    "50:16 Dan sungguh, Kami telah menciptakan manusia dan mengetahui apa yang dibisikkan oleh hatinya, dan Kami lebih dekat kepadanya daripada urat lehernya.",
    "42:28 Dan Dialah yang menurunkan hujan setelah mereka berputus asa dan menyebarkan rahmat-Nya. Dan Dialah Maha Pelindung, Maha Terpuji.",
    "39:53 Katakanlah, 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya. Sungguh, Dialah Yang Maha Pengampun, Maha Penyayang.'",
    "16:97 Barangsiapa mengerjakan kebajikan, baik laki-laki maupun perempuan dalam keadaan beriman, maka pasti akan Kami berikan kepadanya kehidupan yang baik dan pasti akan Kami beri balasan dengan pahala yang lebih baik dari apa yang telah mereka kerjakan.",
    "10:25 Dan Allah menyeru (manusia) ke Darussalam (surga), dan Dia memberi petunjuk kepada orang yang Dia kehendaki ke jalan yang lurus.",
    "18:88 Adapun orang yang beriman dan mengerjakan kebajikan, maka dia mendapat balasan yang terbaik sebagai tempat kembali, dan akan Kami katakan kepadanya (perintah) kami yang mudah.",
    "29:69 Dan orang-orang yang berjihad untuk (mencari keridaan) Kami, pasti akan Kami tunjukkan kepada mereka jalan-jalan Kami. Dan sungguh, Allah beserta orang-orang yang berbuat baik.",
    "8:46 Dan taatilah Allah dan Rasul-Nya dan janganlah kamu berselisih, yang menyebabkan kamu menjadi gentar dan kekuatanmu hilang dan bersabarlah. Sungguh, Allah beserta orang-orang yang sabar.",
    "3:146 Dan betapa banyak Nabi yang berperang didampingi sejumlah besar dari pengikut (mereka) yang bertakwa. Mereka tidak (menjadi) lemah karena bencana yang menimpa mereka di jalan Allah, tidak lesu dan tidak (pula) menyerah (kepada musuh). Dan Allah mencintai orang-orang yang sabar.",
    "12:87 Wahai anak-anakku! Pergilah dan carilah berita tentang Yusuf dan saudaranya dan janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya yang berputus asa dari rahmat Allah, hanyalah orang-orang yang kafir.",
    "30:50 Maka perhatikanlah bekas-bekas rahmat Allah, bagaimana Dia menghidupkan bumi setelah mati (kering). Sungguh, itu berarti Dia pasti (sanggup) menghidupkan orang-orang yang mati. Dan Dia Maha Kuasa atas segala sesuatu.",
    "11:88 Dia (Shu'aib) berkata, 'Wahai kaumku! Terangkanlah kepadaku jika aku mempunyai bukti yang nyata dari Tuhanku dan aku dianugerahi-Nya rezeki yang baik (halal). Aku tidak bermaksud menyalahi kamu (dengan mengerjakan) apa yang aku larang. Aku hanya bermaksud (memperbaiki) sedapat mungkin. Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada Allah aku bertawakal dan hanya kepada-Nya aku kembali.'",
    "12:18 Dan mereka datang membawa baju gamisnya (yang berlumuran) darah palsu. Dia (Yakub) berkata, 'Sebenarnya hanya dirimu sendirilah yang menganggap baik urusan (yang buruk) itu. Maka kesabaran yang baik itu adalah (kesabaranku). Dan Allah sajalah yang dimohon pertolongan-Nya terhadap apa yang kamu ceritakan.'",
    "90:4 Sungguh, Kami telah menciptakan manusia berada dalam susah payah.",
    "46:35 Maka bersabarlah engkau (Muhammad) sebagaimana kesabaran rasul-rasul yang memiliki keteguhan hati dan janganlah engkau meminta agar azab disegerakan untuk mereka. Pada hari mereka melihat azab yang diancamkan kepada mereka (merasa) seolah-olah mereka tidak tinggal (di dunia) melainkan sesaat pada siang hari. (Inilah) suatu pelajaran (yang cukup), maka tidak dibinasakan kecuali kaum yang fasik.",
    "2:214 Atau apakah kamu mengira bahwa kamu akan masuk surga, padahal belum datang kepadamu (cobaan) sebagaimana halnya orang-orang terdahulu sebelum kamu? Mereka ditimpa malapetaka dan kesengsaraan, serta diguncang (dengan berbagai cobaan), sehingga Rasul dan orang-orang yang beriman bersamanya berkata, 'Kapankah datang pertolongan Allah?' Ingatlah, sesungguhnya pertolongan Allah itu amat dekat.",
    "93:3-4 🔓 Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak (pula) membencimu, (3) dan sungguh, yang kemudian itu lebih baik bagimu dari yang permulaan. (4)",
    "25:74 Dan orang-orang yang berkata, 'Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.'"
]

In_haram_tendency_verses = [
    "39:53 Katakanlah, 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya. Sungguh, Dialah Yang Maha Pengampun, Maha Penyayang.'",
    "4:110 Dan barangsiapa mengerjakan kejahatan atau menganiaya dirinya, kemudian dia memohon ampunan kepada Allah, niscaya dia akan mendapatkan Allah Maha Pengampun, Maha Penyayang.",
    "42:25 Dan Dialah yang menerima tobat dari hamba-hamba-Nya dan memaafkan kesalahan-kesalahan serta mengetahui apa yang kamu kerjakan.",
    "5:39 Maka barangsiapa bertobat setelah kejahatannya itu dan memperbaiki diri, maka sesungguhnya Allah menerima tobatnya. Sungguh, Allah Maha Pengampun, Maha Penyayang.",
    "3:135 Dan (juga) orang-orang yang apabila mengerjakan perbuatan keji atau menzalimi diri sendiri, (segera) mengingat Allah, lalu memohon ampunan atas dosa-dosanya. Dan siapa (lagi) yang dapat mengampuni dosa-dosa selain Allah? Dan mereka tidak meneruskan perbuatan keji itu, sedang mereka mengetahui.",
    "65:2-3 🔓 Kemudian apabila mereka telah mendekati akhir idahnya, maka rujukilah (mereka) dengan baik atau lepaskanlah mereka dengan baik dan persaksikanlah dengan dua orang saksi yang adil di antara kamu dan tegakkanlah kesaksian itu karena Allah. Demikianlah diberi pengajaran dengan itu orang yang beriman kepada Allah dan hari akhir. Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar. (2) Dan memberinya rezeki dari arah yang tidak disangka-sangkanya. Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan-Nya. Sungguh, Allah telah mengadakan ketentuan bagi setiap sesuatu. (3)",
    "33:70-71 🔓 Wahai orang-orang yang beriman! Bertakwalah kamu kepada Allah dan ucapkanlah perkataan yang benar, (70) niscaya Allah akan memperbaiki amal-amalmu dan mengampuni dosa-dosamu. Dan barangsiapa menaati Allah dan Rasul-Nya, maka sungguh, dia menang dengan kemenangan yang agung. (71)",
    "2:199 Kemudian bertolaklah kamu dari tempat bertolaknya orang banyak ('Arafah) dan mohonlah ampunan kepada Allah. Sungguh, Allah Maha Pengampun, Maha Penyayang.",
    "24:31 Dan katakanlah kepada para perempuan yang beriman, agar mereka menjaga pandangannya, dan memelihara kemaluannya, dan janganlah menampakkan perhiasannya (auratnya), kecuali yang (biasa) terlihat. Dan hendaklah mereka menutupkan kain kerudung ke dadanya, dan janganlah menampakkan perhiasannya (auratnya), kecuali kepada suami mereka, atau ayah mereka, atau ayah suami mereka, atau putra-putra mereka, atau putra-putra suami mereka, atau saudara-saudara laki-laki mereka, atau putra-putra saudara laki-laki mereka, atau putra-putra saudara perempuan mereka, atau para perempuan (sesama muslim) mereka, atau hamba sahaya yang mereka miliki, atau para pelayan laki-laki (tua) yang tidak mempunyai keinginan (terhadap perempuan) atau anak-anak yang belum mengerti tentang aurat perempuan. Dan janganlah mereka menghentakkan kakinya agar diketahui perhiasan yang mereka sembunyikan. Dan bertobatlah kamu semua kepada Allah, wahai orang-orang yang beriman, agar kamu beruntung.",
    "4:28 Allah hendak memberikan keringanan kepadamu, dan manusia dijadikan bersifat lemah.",
    "2:286 Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari (kebajikan) yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya. (Mereka berdoa): 'Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami tersalah. Ya Tuhan kami, janganlah Engkau bebankan kepada kami beban yang berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Ya Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tak sanggup kami memikulnya. Beri maaflah kami; ampunilah kami; dan rahmatilah kami. Engkaulah Pelindung kami, maka tolonglah kami terhadap kaum yang kafir.'",
    "16:97 Barangsiapa mengerjakan kebajikan, baik laki-laki maupun perempuan dalam keadaan beriman, maka pasti akan Kami berikan kepadanya kehidupan yang baik dan pasti akan Kami beri balasan dengan pahala yang lebih baik dari apa yang telah mereka kerjakan.",
    "29:69 Dan orang-orang yang berjihad untuk (mencari keridaan) Kami, pasti akan Kami tunjukkan kepada mereka jalan-jalan Kami. Dan sungguh, Allah beserta orang-orang yang berbuat baik.",
    "3:102 Wahai orang-orang yang beriman! Bertakwalah kepada Allah sebenar-benar takwa kepada-Nya; dan janganlah kamu mati kecuali dalam keadaan muslim.",
    "3:103 Dan berpegangteguhlah kamu semuanya pada tali (agama) Allah, dan janganlah kamu bercerai berai, dan ingatlah nikmat Allah kepadamu ketika kamu dahulu (masa Jahiliah) bermusuhan, lalu Allah mempersatukan hatimu, sehingga dengan karunia-Nya kamu menjadi bersaudara, sedangkan (sewaktu itu) kamu berada di tepi jurang neraka, lalu Allah menyelamatkan kamu dari sana. Demikianlah Allah menerangkan ayat-ayat-Nya kepadamu agar kamu mendapat petunjuk.",
    "49:13 Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal. Sesungguhnya yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa. Sungguh, Allah Maha Mengetahui, Maha Teliti.",
    "13:11 Baginya (manusia) ada malaikat-malaikat yang selalu mengikutinya secara bergiliran, di hadapan dan di belakangnya, mereka menjaganya atas perintah Allah. Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sebelum mereka mengubah keadaan diri mereka sendiri. Dan apabila Allah menghendaki keburukan terhadap suatu kaum, maka tidak ada yang dapat menolaknya; dan tidak ada pelindung bagi mereka selain Dia.",
    "2:45 Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Dan (salat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk,",
    "66:8 Wahai orang-orang yang beriman! Bertobatlah kepada Allah dengan tobat yang semurni-murninya (nasuha), mudah-mudahan Tuhan kamu akan menghapus kesalahan-kesalahanmu dan memasukkan kamu ke dalam surga yang mengalir di bawahnya sungai-sungai, pada hari ketika Allah tidak menghinakan Nabi dan orang-orang yang beriman bersama dia; sedang cahaya mereka memancar di hadapan dan di sebelah kanan mereka, sambil mereka berkata, 'Ya Tuhan kami, sempurnakanlah bagi kami cahaya kami dan ampunilah kami; sungguh Engkau Mahakuasa atas segala sesuatu.'",
    "25:70 Kecuali orang-orang yang bertobat, beriman dan mengerjakan kebajikan, maka kejahatan mereka diganti Allah dengan kebajikan. Allah Mahapengampun, Maha Penyayang.",
    "7:156 Dan catatlah untuk kami kebaikan di dunia ini dan di akhirat. Sungguh, kami kembali (bertobat) kepada Engkau.' Dia (Allah) berfirman, 'Siksaan-Ku akan Aku timpakan kepada siapa yang Aku kehendaki, dan rahmat-Ku meliputi segala sesuatu. Maka akan Aku tetapkan rahmat-Ku bagi orang-orang yang bertakwa, yang menunaikan zakat dan orang-orang yang beriman kepada ayat-ayat Kami.'",
    "17:25 Tuhanmu lebih mengetahui apa yang ada dalam hatimu. Jika kamu orang yang baik, maka sungguh, Dia Maha Pengampun bagi orang yang bertobat.",
    "6:54 Dan apabila orang-orang yang beriman kepada ayat-ayat Kami datang kepadamu, maka katakanlah, 'Salamun ‘alaikum (keselamatan dilimpahkan kepadamu).' Tuhanmu telah menetapkan sifat kasih sayang pada diri-Nya, (yaitu) barangsiapa berbuat kejahatan di antara kamu karena kebodohan, kemudian dia bertobat setelah itu dan memperbaiki diri, maka sungguh, Dia Maha Pengampun, Maha Penyayang."
]

def indonesian(request):
    return render(request, 'La_Indonesian.html')

def In_anxious(request):
    verse = random.choice(In_anxious_verses)
    return render(request, 'anxious.html', {'verse': verse})

def In_happy(request):
    verse = random.choice(In_happy_verses)
    return render(request, 'happy.html', {'verse': verse})

def In_thankful(request):
    verse = random.choice(In_thankful_verses)
    return render(request, 'thankful.html', {'verse': verse})

def In_lonely(request):
    verse = random.choice(In_lonely_verses)
    return render(request, 'lonely.html', {'verse': verse})

def In_angry(request):
    verse = random.choice(In_angry_verses)
    return render(request, 'angry.html', {'verse': verse})

def In_sad(request):
    verse = random.choice(In_sad_verses)
    return render(request, 'sad.html', {'verse': verse})

def In_haram_tendency(request):
    verse = random.choice(In_haram_tendency_verses)
    return render(request, 'haram_tendency.html', {'verse': verse})


#Arabic
Ar_anxious_verses = [
    "3:54 وَمَكَرُوا وَمَكَرَ اللَّهُ ۖ وَاللَّهُ خَيْرُ الْمَاكِرِينَ",
    "8:30 وَإِذْ يَمْكُرُ بِكَ الَّذِينَ كَفَرُوا لِيُثْبِتُوكَ أَوْ يَقْتُلُوكَ أَوْ يُخْرِجُوكَ ۚ وَيَمْكُرُونَ وَيَمْكُرُ اللَّهُ ۖ وَاللَّهُ خَيْرُ الْمَاكِرِينَ",
    "13:28 الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "2:45 وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    "94:5-6 🔓 فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿5﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿6﴾",
    "2:286 لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    "64:11 مَا أَصَابَ مِنْ مُصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ ۗ وَمَنْ يُؤْمِنْ بِاللَّهِ يَهْدِ قَلْبَهُ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
    "65:3 وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    "20:46 قَالَ لَا تَخَافَا ۖ إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَىٰ",
    "3:173 الَّذِينَ قَالَ لَهُمُ النَّاسُ إِنَّ النَّاسَ قَدْ جَمَعُوا لَكُمْ فَاخْشَوْهُمْ فَزَادَهُمْ إِيمَانًا وَقَالُوا حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    "9:40 إِلَّا تَنْصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا ۖ فَأَنْزَلَ اللَّهُ سَكِينَتَهُ عَلَيْهِ وَأَيَّدَهُ بِجُنُودٍ لَمْ تَرَوْهَا وَجَعَلَ كَلِمَةَ الَّذِينَ كَفَرُوا السُّفْلَىٰ ۗ وَكَلِمَةُ اللَّهِ هِيَ الْعُلْيَا ۗ وَاللَّهُ عَزِيزٌ حَكِيمٌ",
    "4:81 وَيَقُولُونَ طَاعَةٌ فَإِذَا بَرَزُوا مِنْ عِنْدِكَ بَيَّتَ طَائِفَةٌ مِنْهُمْ غَيْرَ الَّذِي تَقُولُ ۖ وَاللَّهُ يَكْتُبُ مَا يُبَيِّتُونَ ۖ فَأَعْرِضْ عَنْهُمْ وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا",
    "9:51 قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا ۚ وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ",
    "50:16 وَلَقَدْ خَلَقْنَا الْإِنْسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ ۖ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    "42:28 وَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ مِنْ بَعْدِ مَا قَنَطُوا وَيَنْشُرُ رَحْمَتَهُ ۚ وَهُوَ الْوَلِيُّ الْحَمِيدُ",
    "3:159 فَبِمَا رَحْمَةٍ مِنَ اللَّهِ لِنْتَ لَهُمْ ۖ وَلَوْ كُنْتَ فَظًّا غَلِيظَ الْقَلْبِ لَانْفَضُّوا مِنْ حَوْلِكَ ۖ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    "33:3 وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا",
    "12:64 قَالَ هَلْ آمَنُكُمْ عَلَيْهِ إِلَّا كَمَا أَمِنْتُكُمْ عَلَىٰ أَخِيهِ مِنْ قَبْلُ ۚ فَاللَّهُ خَيْرٌ حَافِظًا ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    "2:216 كُتِبَ عَلَيْكُمُ الْقِتَالُ وَهُوَ كُرْهٌ لَّكُمْ ۖ وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ",
    "3:139 وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    "16:127 وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ ۚ وَلَا تَحْزَنْ عَلَيْهِمْ وَلَا تَكُ فِي ضَيْقٍ مِمَّا يَمْكُرُونَ",
    "29:2-3 🔓 أَحَسِبَ النَّاسُ أَنْ يُتْرَكُوا أَنْ يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ ﴿2﴾ وَلَقَدْ فَتَنَّا الَّذِينَ مِنْ قَبْلِهِمْ ۖ فَلَيَعْلَمَنَّ اللَّهُ الَّذِينَ صَدَقُوا وَلَيَعْلَمَنَّ الْكَاذِبِينَ ﴿3﴾",
    "23:115 أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا وَأَنَّكُمْ إِلَيْنَا لَا تُرْجَعُونَ",
    "67:2 الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
    "2:214 أَمْ حَسِبْتُمْ أَن تَدْخُلُوا الْجَنَّةَ وَلَمَّا يَأْتِكُم مَّثَلُ الَّذِينَ خَلَوْا مِن قَبْلِكُم ۖ مَّسَّتْهُمُ الْبَأْسَاءُ وَالضَّرَّاءُ وَزُلْزِلُوا حَتَّىٰ يَقُولَ الرَّسُولُ وَالَّذِينَ آمَنُوا مَعَهُ مَتَىٰ نَصْرُ اللَّهِ ۗ أَلَا إِنَّ نَصْرَ اللَّهِ قَرِيبٌ",
    "2:155-156 🔓 وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ ﴿155﴾ الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴿156﴾",
    "2:153 يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    "7:200 وَإِمَّا يَنْزَغَنَّكَ مِنَ الشَّيْطَانِ نَزْغٌ فَاسْتَعِذْ بِاللَّهِ ۚ إِنَّهُ سَمِيعٌ عَلِيمٌ",
    "4:58 إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ ۚ إِنَّ اللَّهَ نِعِمَّا يَعِظُكُم بِهِ ۗ إِنَّ اللَّهَ كَانَ سَمِيعًا بَصِيرًا",
    "17:110 قُلِ ادْعُوا اللَّهَ أَوِ ادْعُوا الرَّحْمَٰنَ ۖ أَيًّا مَا تَدْعُوا فَلَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ وَلَا تَجْهَرْ بِصَلَاتِكَ وَلَا تُخَافِتْ بِهَا وَابْتَغِ بَيْنَ ذَٰلِكَ سَبِيلًا"
]


Ar_happy_verses = [
    "10:58 قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا هُوَ خَيْرٌ مِمَّا يَجْمَعُونَ", 
    "16:97 مَنْ عَمِلَ صَالِحًا مِنْ ذَكَرٍ أَوْ أُنْثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُمْ بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ", 
    "16:78 وَاللَّهُ أَخْرَجَكُمْ مِنْ بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ لَعَلَّكُمْ تَشْكُرُونَ",
    "16:10-11 🔓 هُوَ الَّذِي أَنْزَلَ مِنَ السَّمَاءِ مَاءً لَكُمْ مِنْهُ شَرَابٌ وَمِنْهُ شَجَرٌ فِيهِ تُسِيمُونَ ﴿10﴾ يُنْبِتُ لَكُمْ بِهِ الزَّرْعَ وَالزَّيْتُونَ وَالنَّخِيلَ وَالْأَعْنَابَ وَمِنْ كُلِّ الثَّمَرَاتِ ۗ إِنَّ فِي ذَٰلِكَ لَآيَةً لِقَوْمٍ يَتَفَكَّرُونَ ﴿11﴾",
    "16:80 وَاللَّهُ جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا وَجَعَلَ لَكُمْ مِنْ جُلُودِ الْأَنْعَامِ بُيُوتًا تَسْتَخِفُّونَهَا يَوْمَ ظَعْنِكُمْ وَيَوْمَ إِقَامَتِكُمْ ۙ وَمِنْ أَصْوَافِهَا وَأَوْبَارِهَا وَأَشْعَارِهَا أَثَاثًا وَمَتَاعًا إِلَىٰ حِينٍ",
    "2:186 وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
    "16:53 وَمَا بِكُمْ مِنْ نِعْمَةٍ فَمِنَ اللَّهِ ۖ ثُمَّ إِذَا مَسَّكُمُ الضُّرُّ فَإِلَيْهِ تَجْأَرُونَ",
    "16:18 وَإِنْ تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا ۗ إِنَّ اللَّهَ لَغَفُورٌ رَحِيمٌ",
    "16:81 وَاللَّهُ جَعَلَ لَكُمْ مِمَّا خَلَقَ ظِلَالًا وَجَعَلَ لَكُمْ مِنَ الْجِبَالِ أَكْنَانًا وَجَعَلَ لَكُمْ سَرَابِيلَ تَقِيكُمُ الْحَرَّ وَسَرَابِيلَ تَقِيكُمْ بَأْسَكُمْ ۚ كَذَٰلِكَ يُتِمُّ نِعْمَتَهُ عَلَيْكُمْ لَعَلَّكُمْ تُسْلِمُونَ",
    "21:35 كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَنَبْلُوكُمْ بِالشَّرِّ وَالْخَيْرِ فِتْنَةً ۖ وَإِلَيْنَا تُرْجَعُونَ",
    "2:25 وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ ۖ كُلَّمَا رُزِقُوا مِنْهَا مِنْ ثَمَرَةٍ رِزْقًا ۙ قَالُوا هَٰذَا الَّذِي رُزِقْنَا مِنْ قَبْلُ ۖ وَأُتُوا بِهِ مُتَشَابِهًا ۖ وَلَهُمْ فِيهَا أَزْوَاجٌ مُطَهَّرَةٌ ۖ وَهُمْ فِيهَا خَالِدُونَ",
    "18:88 وَأَمَّا مَنْ آمَنَ وَعَمِلَ صَالِحًا فَلَهُ جَزَاءً الْحُسْنَىٰ ۖ وَسَنَقُولُ لَهُ مِنْ أَمْرِنَا يُسْرًا",
    "10:25 وَاللَّهُ يَدْعُو إِلَىٰ دَارِ السَّلَامِ وَيَهْدِي مَنْ يَشَاءُ إِلَىٰ صِرَاطٍ مُسْتَقِيمٍ",
    "39:53 قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
    "25:70 إِلَّا مَنْ تَابَ وَآمَنَ وَعَمِلَ عَمَلًا صَالِحًا فَأُولَٰئِكَ يُبَدِّلُ اللَّهُ سَيِّئَاتِهِمْ حَسَنَاتٍ ۗ وَكَانَ اللَّهُ غَفُورًا رَحِيمًا",
    "103:1-3 🔓 وَالْعَصْرِ ﴿1﴾ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ﴿2﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿3﴾",
    "4:69 وَمَنْ يُطِعِ اللَّهَ وَالرَّسُولَ فَأُولَٰئِكَ مَعَ الَّذِينَ أَنْعَمَ اللَّهُ عَلَيْهِمْ مِنَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ وَالصَّالِحِينَ ۚ وَحَسُنَ أُولَٰئِكَ رَفِيقًا",
    "9:21 يُبَشِّرُهُمْ رَبُّهُمْ بِرَحْمَةٍ مِنْهُ وَرِضْوَانٍ وَجَنَّاتٍ لَهُمْ فِيهَا نَعِيمٌ مُقِيمٌ",
    "13:29 الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ طُوبَىٰ لَهُمْ وَحُسْنُ مَآبٍ",
    "32:17 فَلَا تَعْلَمُ نَفْسٌ مَا أُخْفِيَ لَهُمْ مِنْ قُرَّةِ أَعْيُنٍ جَزَاءً بِمَا كَانُوا يَعْمَلُونَ",
    "36:55 إِنَّ أَصْحَابَ الْجَنَّةِ الْيَوْمَ فِي شُغُلٍ فَاكِهُونَ",
    "43:70 ادْخُلُوا الْجَنَّةَ أَنْتُمْ وَأَزْوَاجُكُمْ تُحْبَرُونَ",
    "76:11 فَوَقَاهُمُ اللَّهُ شَرَّ ذَٰلِكَ الْيَوْمِ وَلَقَّاهُمْ نَضْرَةً وَسُرُورًا",
    "89:27-30 🔓 يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ﴿27﴾ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَرْضِيَّةً ﴿28﴾ فَادْخُلِي فِي عِبَادِي ﴿29﴾ وَادْخُلِي جَنَّتِي ﴿30﴾",
    "48:4 هُوَ الَّذِي أَنْزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَعَ إِيمَانِهِمْ ۗ وَلِلَّهِ جُنُودُ السَّمَاوَاتِ وَالْأَرْضِ ۚ وَكَانَ اللَّهُ عَلِيمًا حَكِيمًا",
    "24:35 اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِنْ شَجَرَةٍ مُبَارَكَةٍ زَيْتُونَةٍ لَا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُورٌ عَلَىٰ نُورٍ ۗ يَهْدِي اللَّهُ لِنُورِهِ مَنْ يَشَاءُ ۚ وَيَضْرِبُ اللَّهُ الْأَمْثَالَ لِلنَّاسِ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
    "55:60 هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ",
    "41:30 إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ أَلَّا تَخَافُوا وَلَا تَحْزَنُوا وَأَبْشِرُوا بِالْجَنَّةِ الَّتِي كُنْتُمْ تُوعَدُونَ"
]

Ar_thankful_verses = [
    "14:7 وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    "16:78 وَاللَّهُ أَخْرَجَكُمْ مِنْ بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ لَعَلَّكُمْ تَشْكُرُونَ",
    "2:152 فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    "2:172 يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ",
    "27:40 قَالَ الَّذِي عِنْدَهُ عِلْمٌ مِّنَ الْكِتَابِ أَنَا آتِيكَ بِهِ قَبْلَ أَن يَرْتَدَّ إِلَيْكَ طَرْفُكَ ۚ فَلَمَّا رَآهُ مُسْتَقِرًّا عِنْدَهُ قَالَ هَٰذَا مِن فَضْلِ رَبِّي لِيَبْلُوَنِي أَأَشْكُرُ أَمْ أَكْفُرُ ۖ وَمَن شَكَرَ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ ۖ وَمَن كَفَرَ فَإِنَّ رَبِّي غَنِيٌّ كَرِيمٌ",
    "31:12 وَلَقَدْ آتَيْنَا لُقْمَانَ الْحِكْمَةَ أَنِ اشْكُرْ لِلَّهِ ۚ وَمَن يَشْكُرْ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ ۖ وَمَن كَفَرَ فَإِنَّ اللَّهَ غَنِيٌّ حَمِيدٌ",
    "16:53 وَمَا بِكُمْ مِنْ نِعْمَةٍ فَمِنَ اللَّهِ ۖ ثُمَّ إِذَا مَسَّكُمُ الضُّرُّ فَإِلَيْهِ تَجْأَرُونَ",
    "14:34 وَآتَاكُم مِّن كُلِّ مَا سَأَلْتُمُوهُ ۚ وَإِن تَعُدُّوا نِعْمَتَ اللَّهِ لَا تُحْصُوهَا ۗ إِنَّ الْإِنسَانَ لَظَلُومٌ كَفَّارٌ",
    "34:13 يَعْمَلُونَ لَهُ مَا يَشَاءُ مِن مَّحَارِيبَ وَتَمَاثِيلَ وَجِفَانٍ كَالْجَوَابِ وَقُدُورٍ رَّاسِيَاتٍ ۚ اعْمَلُوا آلَ دَاوُودَ شُكْرًا ۚ وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ",
    "3:145 وَمَا كَانَ لِنَفْسٍ أَن تَمُوتَ إِلَّا بِإِذْنِ اللَّهِ كِتَابًا مُّؤَجَّلًا ۗ وَمَن يُرِدْ ثَوَابَ الدُّنْيَا نُؤْتِهِ مِنْهَا وَمَن يُرِدْ ثَوَابَ الْآخِرَةِ نُؤْتِهِ مِنْهَا ۚ وَسَنَجْزِي الشَّاكِرِينَ",
    "16:81 وَاللَّهُ جَعَلَ لَكُم مِّمَّا خَلَقَ ظِلَالًا وَجَعَلَ لَكُم مِّنَ الْجِبَالِ أَكْنَانًا وَجَعَلَ لَكُم سَرَابِيلَ تَقِيكُمُ الْحَرَّ وَسَرَابِيلَ تَقِيكُم بَأْسَكُمْ ۚ كَذَٰلِكَ يُتِمُّ نِعْمَتَهُ عَلَيْكُمْ لَعَلَّكُمْ تُسْلِمُونَ",
    "27:73 وَإِنَّ رَبَّكَ لَذُو فَضْلٍ عَلَى النَّاسِ وَلَٰكِنَّ أَكْثَرَهُمْ لَا يَشْكُرُونَ",
    "55:13 فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    "17:3 ذُرِّيَّةَ مَنْ حَمَلْنَا مَعَ نُوحٍ ۚ إِنَّهُ كَانَ عَبْدًا شَكُورًا",
    "76:9 إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ اللَّهِ لَا نُرِيدُ مِنكُمْ جَزَاءً وَلَا شُكُورًا",
    "2:243 أَلَمْ تَرَ إِلَى الَّذِينَ خَرَجُوا مِن دِيَارِهِمْ وَهُمْ أُلُوفٌ حَذَرَ الْمَوْتِ فَقَالَ لَهُمُ اللَّهُ مُوتُوا ثُمَّ أَحْيَاهُمْ ۚ إِنَّ اللَّهَ لَذُو فَضْلٍ عَلَى النَّاسِ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَشْكُرُونَ",
    "8:26 وَاذْكُرُوا إِذْ أَنتُمْ قَلِيلٌ مُّسْتَضْعَفُونَ فِي الْأَرْضِ تَخَافُونَ أَن يَتَخَطَّفَكُمُ النَّاسُ فَآوَاكُمْ وَأَيَّدَكُم بِنَصْرِهِ وَرَزَقَكُم مِّنَ الطَّيِّبَاتِ لَعَلَّكُمْ تَشْكُرُونَ",
    "35:3 يَا أَيُّهَا النَّاسُ اذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ ۚ هَلْ مِنْ خَالِقٍ غَيْرُ اللَّهِ يَرْزُقُكُم مِّنَ السَّمَاءِ وَالْأَرْضِ ۚ لَا إِلَٰهَ إِلَّا هُوَ ۖ فَأَنَّىٰ تُؤْفَكُونَ",
    "16:114 فَكُلُوا مِمَّا رَزَقَكُمُ اللَّهُ حَلَالًا طَيِّبًا وَاشْكُرُوا نِعْمَتَ اللَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ",
    "29:17 إِنَّمَا تَعْبُدُونَ مِن دُونِ اللَّهِ أَوْثَانًا وَتَخْلُقُونَ إِفْكًا ۚ إِنَّ الَّذِينَ تَعْبُدُونَ مِن دُونِ اللَّهِ لَا يَمْلِكُونَ لَكُمْ رِزْقًا فَابْتَغُوا عِندَ اللَّهِ الرِّزْقَ وَاعْبُدُوهُ وَاشْكُرُوا لَهُ ۖ إِلَيْهِ تُرْجَعُونَ",
    "7:10 وَلَقَدْ مَكَّنَّاكُمْ فِي الْأَرْضِ وَجَعَلْنَا لَكُمْ فِيهَا مَعَايِشَ ۗ قَلِيلًا مَّا تَشْكُرُونَ",
    "6:63 قُلْ مَن يُنَجِّيكُم مِّن ظُلُمَاتِ الْبَرِّ وَالْبَحْرِ تَدْعُونَهُ تَضَرُّعًا وَخُفْيَةً لَّئِنْ أَنجَانَا مِنْ هَٰذِهِ لَنَكُونَنَّ مِنَ الشَّاكِرِينَ",
    "14:5 وَلَقَدْ أَرْسَلْنَا مُوسَىٰ بِآيَاتِنَا أَنْ أَخْرِجْ قَوْمَكَ مِنَ الظُّلُمَاتِ إِلَى النُّورِ وَذَكِّرْهُم بِأَيَّامِ اللَّهِ ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّكُلِّ صَبَّارٍ شَكُورٍ",
    "54:35 مِن عِندِنَا ۚ كَذَٰلِكَ نَجْزِي مَن شَكَرَ",
    "17:19 وَمَنْ أَرَادَ الْآخِرَةَ وَسَعَىٰ لَهَا سَعْيَهَا وَهُوَ مُؤْمِنٌ فَأُولَٰئِكَ كَانَ سَعْيُهُم مَّشْكُورًا"
]

Ar_lonely_verses = [
    "50:16 وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ ۖ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    "2:186 وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
    "57:4 هُوَ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ فِي سِتَّةِ أَيَّامٍ ثُمَّ اسْتَوَىٰ عَلَى الْعَرْشِ ۚ يَعْلَمُ مَا يَلِجُ فِي الْأَرْضِ وَمَا يَخْرُجُ مِنْهَا وَمَا يَنزِلُ مِنَ السَّمَاءِ وَمَا يَعْرُجُ فِيهَا ۖ وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
    "20:46 قَالَ لَا تَخَافَا ۖ إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَىٰ",
    "4:81 وَيَقُولُونَ طَاعَةٌ فَإِذَا بَرَزُوا مِنْ عِندِكَ بَيَّتَ طَائِفَةٌ مِّنْهُمْ غَيْرَ الَّذِي تَقُولُ ۖ وَاللَّهُ يَكْتُبُ مَا يُبَيِّتُونَ ۖ فَأَعْرِضْ عَنْهُمْ وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا",
    "19:96 إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا",
    "33:41-42 🔓 يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا ﴿41﴾ وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا ﴿42﴾",
    "2:45 وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    "65:3 وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    "11:123 وَلِلَّهِ غَيْبُ السَّمَاوَاتِ وَالْأَرْضِ وَإِلَيْهِ يُرْجَعُ الْأَمْرُ كُلُّهُ فَاعْبُدْهُ وَتَوَكَّلْ عَلَيْهِ ۚ وَمَا رَبُّكَ بِغَافِلٍ عَمَّا تَعْمَلُونَ",
    "10:25 وَاللَّهُ يَدْعُو إِلَىٰ دَارِ السَّلَامِ وَيَهْدِي مَن يَشَاءُ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
    "29:69 وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    "13:28 الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "2:257 اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُمْ مِنَ الظُّلُمَاتِ إِلَى النُّورِ ۖ وَالَّذِينَ كَفَرُوا أَوْلِيَاؤُهُمُ الطَّاغُوتُ يُخْرِجُونَهُمْ مِنَ النُّورِ إِلَى الظُّلُمَاتِ ۗ أُولَٰئِكَ أَصْحَابُ النَّارِ ۖ هُمْ فِيهَا خَالِدُونَ",
    "58:7 أَلَمْ تَرَ أَنَّ اللَّهَ يَعْلَمُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۖ مَا يَكُونُ مِن نَّجْوَىٰ ثَلَاثَةٍ إِلَّا هُوَ رَابِعُهُمْ وَلَا خَمْسَةٍ إِلَّا هُوَ سَادِسُهُمْ وَلَا أَدْنَىٰ مِن ذَٰلِكَ وَلَا أَكْثَرَ إِلَّا هُوَ مَعَهُمْ أَيْنَ مَا كَانُوا ۖ ثُمَّ يُنَبِّئُهُم بِمَا عَمِلُوا يَوْمَ الْقِيَامَةِ ۚ إِنَّ اللَّهَ بِكُلِّ شَيْءٍ عَلِيمٌ",
    "24:35 اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُورٌ عَلَىٰ نُورٍ ۗ يَهْدِي اللَّهُ لِنُورِهِ مَن يَشَاءُ ۚ وَيَضْرِبُ اللَّهُ الْأَمْثَالَ لِلنَّاسِ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
    "94:1-4 🔓 أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ﴿1﴾ وَوَضَعْنَا عَنكَ وِزْرَكَ ﴿2﴾ الَّذِي أَنقَضَ ظَهْرَكَ ﴿3﴾ وَرَفَعْنَا لَكَ ذِكْرَكَ ﴿4﴾",
    "23:60 وَالَّذِينَ يُؤْتُونَ مَا آتَوا وَّقُلُوبُهُمْ وَجِلَةٌ أَنَّهُمْ إِلَىٰ رَبِّهِمْ رَاجِعُونَ",
    "2:153 يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    "4:108 يَسْتَخْفُونَ مِنَ النَّاسِ وَلَا يَسْتَخْفُونَ مِنَ اللَّهِ وَهُوَ مَعَهُمْ إِذْ يُبَيِّتُونَ مَا لَا يَرْضَىٰ مِنَ الْقَوْلِ ۚ وَكَانَ اللَّهُ بِمَا يَعْمَلُونَ مُحِيطًا",
    "4:147 مَّا يَفْعَلُ اللَّهُ بِعَذَابِكُمْ إِن شَكَرْتُمْ وَآمَنتُمْ ۚ وَكَانَ اللَّهُ شَاكِرًا عَلِيمًا",
    "2:62 إِنَّ الَّذِينَ آمَنُوا وَالَّذِينَ هَادُوا وَالنَّصَارَىٰ وَالصَّابِئِينَ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَعَمِلَ صَالِحًا فَلَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    "94:7-8 🔓 فَإِذَا فَرَغْتَ فَانصَبْ ﴿7﴾ وَإِلَىٰ رَبِّكَ فَارْغَب ﴿8﴾"
]
Ar_angry_verses = [
    "42:40 وَجَزَاءُ سَيِّئَةٍ سَيِّئَةٌ مِّثْلُهَا ۖ فَمَنْ عَفَا وَأَصْلَحَ فَأَجْرُهُ عَلَى اللَّهِ ۚ إِنَّهُ لَا يُحِبُّ الظَّالِمِينَ",
    "42:37 وَالَّذِينَ يَجْتَنِبُونَ كَبَائِرَ الْإِثْمِ وَالْفَوَاحِشَ وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ",
    "3:134 الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    "7:199 خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ",
    "41:34 وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ ۚ ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ فَإِذَا الَّذِي بَيْنَكَ وَبَيْنَهُ عَدَاوَةٌ كَأَنَّهُ وَلِيٌّ حَمِيمٌ",
    "42:43 وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
    "25:63 وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا",
    "28:55 وَإِذَا سَمِعُوا اللَّغْوَ أَعْرَضُوا عَنْهُ وَقَالُوا لَنَا أَعْمَالُنَا وَلَكُمْ أَعْمَالُكُمْ سَلَامٌ عَلَيْكُمْ لَا نَبْتَغِي الْجَاهِلِينَ",
    "65:3 وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    "16:127 وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ ۚ وَلَا تَحْزَنْ عَلَيْهِمْ وَلَا تَكُ فِي ضَيْقٍ مِمَّا يَمْكُرُونَ",
    "70:5 فَاصْبِرْ صَبْرًا جَمِيلًا",
    "74:7 وَلِرَبِّكَ فَاصْبِرْ",
    "29:69 وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    "2:45 وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    "2:155-156 🔓 وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ ﴿155﴾ الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴿156﴾",
    "94:5-6 🔓 فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿5﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿6﴾",
    "16:126 وَإِنْ عَاقَبْتُمْ فَعَاقِبُوا بِمِثْلِ مَا عُوقِبْتُم بِهِ ۖ وَلَئِن صَبَرْتُمْ لَهُوَ خَيْرٌ لِّلصَّابِرِينَ",
    "39:10 قُلْ يَا عِبَادِ الَّذِينَ آمَنُوا اتَّقُوا رَبَّكُمْ ۚ لِلَّذِينَ أَحْسَنُوا فِي هَٰذِهِ الدُّنْيَا حَسَنَةٌ ۗ وَأَرْضُ اللَّهِ وَاسِعَةٌ ۗ إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ",
    "5:13 فَبِمَا نَقْضِهِم مِّيثَاقَهُمْ لَعَنَّاهُمْ وَجَعَلْنَا قُلُوبَهُمْ قَاسِيَةً ۖ يُحَرِّفُونَ الْكَلِمَ عَن مَّوَاضِعِهِ ۙ وَنَسُوا حَظًّا مِّمَّا ذُكِّرُوا بِهِ ۚ وَلَا تَزَالُ تَطَّلِعُ عَلَىٰ خَائِنَةٍ مِّنْهُمْ إِلَّا قَلِيلًا مِّنْهُمْ ۖ فَاعْفُ عَنْهُمْ وَاصْفَحْ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
    "24:22 وَلَا يَأْتَلِ أُولُو الْفَضْلِ مِنكُمْ وَالسَّعَةِ أَن يُؤْتُوا أُولِي الْقُرْبَىٰ وَالْمَسَاكِينَ وَالْمُهَاجِرِينَ فِي سَبِيلِ اللَّهِ ۖ وَلْيَعْفُوا وَلْيَصْفَحُوا ۗ أَلَا تُحِبُّونَ أَن يَغْفِرَ اللَّهُ لَكُمْ ۗ وَاللَّهُ غَفُورٌ رَّحِيمٌ",
    "45:14 قُل لِّلَّذِينَ آمَنُوا يَغْفِرُوا لِلَّذِينَ لَا يَرْجُونَ أَيَّامَ اللَّهِ لِيَجْزِيَ قَوْمًا بِمَا كَانُوا يَكْسِبُونَ",
    "64:14 يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّ مِنْ أَزْوَاجِكُمْ وَأَوْلَادِكُمْ عَدُوًّا لَّكُمْ فَاحْذَرُوهُمْ ۚ وَإِن تَعْفُوا وَتَصْفَحُوا وَتَغْفِرُوا فَإِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    "15:85 وَمَا خَلَقْنَا السَّمَاوَاتِ وَالْأَرْضَ وَمَا بَيْنَهُمَا إِلَّا بِالْحَقِّ ۗ وَإِنَّ السَّاعَةَ لَآتِيَةٌ ۖ فَاصْفَحِ الصَّفْحَ الْجَمِيلَ",
    "3:159 فَبِمَا رَحْمَةٍ مِنَ اللَّهِ لِنْتَ لَهُمْ ۖ وَلَوْ كُنْتَ فَظًّا غَلِيظَ الْقَلْبِ لَانْفَضُّوا مِنْ حَوْلِكَ ۖ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    "17:53 وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ ۚ إِنَّ الشَّيْطَانَ يَنزَغُ بَيْنَهُمْ ۚ إِنَّ الشَّيْطَانَ كَانَ لِلْإِنسَانِ عَدُوًّا مُّبِينًا"
]


Ar_sad_verses = [
    "2:155-156 🔓 وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ ﴿155﴾ الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴿156﴾",
    "94:5-6 🔓 فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿5﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿6﴾",
    "2:286 لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    "65:3 وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    "64:11 مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ ۗ وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
    "21:35 كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَنَبْلُوكُم بِالشَّرِّ وَالْخَيْرِ فِتْنَةً ۖ وَإِلَيْنَا تُرْجَعُونَ",
    "3:139 وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    "2:186 وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
    "13:28 الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "50:16 وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ ۖ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    "42:28 وَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ مِن بَعْدِ مَا قَنَطُوا وَيَنشُرُ رَحْمَتَهُ ۚ وَهُوَ الْوَلِيُّ الْحَمِيدُ",
    "39:53 قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
    "16:97 مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُم بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ",
    "10:25 وَاللَّهُ يَدْعُو إِلَىٰ دَارِ السَّلَامِ وَيَهْدِي مَن يَشَاءُ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
    "18:88 وَأَمَّا مَنْ آمَنَ وَعَمِلَ صَالِحًا فَلَهُ جَزَاءً الْحُسْنَىٰ ۖ وَسَنَقُولُ لَهُ مِنْ أَمْرِنَا يُسْرًا",
    "29:69 وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    "8:46 وَأَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ ۖ وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    "3:146 وَكَأَيِّن مِّن نَّبِيٍّ قَاتَلَ مَعَهُ رِبِّيُّونَ كَثِيرٌ فَمَا وَهَنُوا لِمَا أَصَابَهُمْ فِي سَبِيلِ اللَّهِ وَمَا ضَعُفُوا وَمَا اسْتَكَانُوا ۗ وَاللَّهُ يُحِبُّ الصَّابِرِينَ",
    "12:87 يَا بَنِيَّ اذْهَبُوا فَتَحَسَّسُوا مِن يُوسُفَ وَأَخِيهِ وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    "30:50 فَانظُرْ إِلَىٰ آثَارِ رَحْمَتِ اللَّهِ كَيْفَ يُحْيِي الْأَرْضَ بَعْدَ مَوْتِهَا ۚ إِنَّ ذَٰلِكَ لَمُحْيِي الْمَوْتَىٰ ۖ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    "11:88 قَالَ يَا قَوْمِ أَرَأَيْتُمْ إِن كُنتُ عَلَىٰ بَيِّنَةٍ مِّن رَّبِّي وَرَزَقَنِي مِنْهُ رِزْقًا حَسَنًا ۚ وَمَا أُرِيدُ أَنْ أُخَالِفَكُمْ إِلَىٰ مَا أَنْهَاكُمْ عَنْهُ ۚ إِنْ أُرِيدُ إِلَّا الْإِصْلَاحَ مَا اسْتَطَعْتُ ۚ وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    "12:18 وَجَاءُوا عَلَىٰ قَمِيصِهِ بِدَمٍ كَذِبٍ ۚ قَالَ بَلْ سَوَّلَتْ لَكُمْ أَنفُسُكُمْ أَمْرًا ۖ فَصَبْرٌ جَمِيلٌ ۖ وَاللَّهُ الْمُسْتَعَانُ عَلَىٰ مَا تَصِفُونَ",
    "90:4 لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ",
    "46:35 فَاصْبِرْ كَمَا صَبَرَ أُولُو الْعَزْمِ مِنَ الرُّسُلِ وَلَا تَسْتَعْجِل لَّهُمْ ۚ كَأَنَّهُمْ يَوْمَ يَرَوْنَ مَا يُوعَدُونَ لَمْ يَلْبَثُوا إِلَّا سَاعَةً مِّن نَّهَارٍ ۚ بَلَاغٌ ۚ فَهَلْ يُهْلَكُ إِلَّا الْقَوْمُ الْفَاسِقُونَ",
    "2:214 أَمْ حَسِبْتُمْ أَن تَدْخُلُوا الْجَنَّةَ وَلَمَّا يَأْتِكُم مَّثَلُ الَّذِينَ خَلَوْا مِن قَبْلِكُم ۖ مَّسَّتْهُمُ الْبَأْسَاءُ وَالضَّرَّاءُ وَزُلْزِلُوا حَتَّىٰ يَقُولَ الرَّسُولُ وَالَّذِينَ آمَنُوا مَعَهُ مَتَىٰ نَصْرُ اللَّهِ ۗ أَلَا إِنَّ نَصْرَ اللَّهِ قَرِيبٌ",
    "93:3-4 🔓 مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ﴿3﴾ وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ ﴿4﴾",
    "25:74 وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا"
]


Ar_haram_tendency_verses = [
    "39:53 قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
    "4:110 وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا",
    "42:25 وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ وَيَعْلَمُ مَا تَفْعَلُونَ",
    "5:39 فَمَن تَابَ مِن بَعْدِ ظُلْمِهِ وَأَصْلَحَ فَإِنَّ اللَّهَ يَتُوبُ عَلَيْهِ ۗ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    "3:135 وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ وَمَن يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ وَلَمْ يُصِرُّوا عَلَىٰ مَا فَعَلُوا وَهُمْ يَعْلَمُونَ",
    "65:2-3 🔓 فَإِذَا بَلَغْنَ أَجَلَهُنَّ فَأَمْسِكُوهُنَّ بِمَعْرُوفٍ أَوْ فَارِقُوهُنَّ بِمَعْرُوفٍ وَأَشْهِدُوا ذَوَيْ عَدْلٍ مِّنكُمْ وَأَقِيمُوا الشَّهَادَةَ لِلَّهِ ۚ ذَٰلِكُمْ يُوعَظُ بِهِ مَن كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ ۚ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ﴿2﴾ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا ﴿3﴾",
    "33:70-71 🔓 يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا ﴿70﴾ يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا ﴿71﴾",
    "2:199 ثُمَّ أَفِيضُوا مِنْ حَيْثُ أَفَاضَ النَّاسُ وَاسْتَغْفِرُوا اللَّهَ ۚ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    "24:31 وَقُل لِّلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ وَيَحْفَظْنَ فُرُوجَهُنَّ وَلَا يُبْدِينَ زِينَتَهُنَّ إِلَّا مَا ظَهَرَ مِنْهَا ۖ وَلْيَضْرِبْنَ بِخُمُرِهِنَّ عَلَىٰ جُيُوبِهِنَّ ۖ وَلَا يُبْدِينَ زِينَتَهُنَّ إِلَّا لِبُعُولَتِهِنَّ أَوْ آبَائِهِنَّ أَوْ آبَاءِ بُعُولَتِهِنَّ أَوْ أَبْنَائِهِنَّ أَوْ أَبْنَاءِ بُعُولَتِهِنَّ أَوْ إِخْوَانِهِنَّ أَوْ بَنِي إِخْوَانِهِنَّ أَوْ بَنِي أَخَوَاتِهِنَّ أَوْ نِسَائِهِنَّ أَوْ مَا مَلَكَتْ أَيْمَانُهُنَّ أَوِ التَّابِعِينَ غَيْرِ أُولِي الْإِرْبَةِ مِنَ الرِّجَالِ أَوِ الطِّفْلِ الَّذِينَ لَمْ يَظْهَرُوا عَلَىٰ عَوْرَاتِ النِّسَاءِ ۖ وَلَا يَضْرِبْنَ بِأَرْجُلِهِنَّ لِيُعْلَمَ مَا يُخْفِينَ مِن زِينَتِهِنَّ ۚ وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ",
    "4:28 يُرِيدُ اللَّهُ أَن يُخَفِّفَ عَنكُمْ ۚ وَخُلِقَ الْإِنسَانُ ضَعِيفًا",
    "2:286 لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    "16:97 مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُم بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ",
    "29:69 وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    "3:102 يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنتُم مُّسْلِمُونَ",
    "3:103 وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا ۚ وَاذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ إِذْ كُنتُمْ أَعْدَاءً فَأَلَّفَ بَيْنَ قُلُوبِكُمْ فَأَصْبَحْتُم بِنِعْمَتِهِ إِخْوَانًا وَكُنتُمْ عَلَىٰ شَفَا حُفْرَةٍ مِّنَ النَّارِ فَأَنقَذَكُم مِّنْهَا ۗ كَذَٰلِكَ يُبَيِّنُ اللَّهُ لَكُمْ آيَاتِهِ لَعَلَّكُمْ تَهْتَدُونَ",
    "49:13 يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
    "13:11 لَهُ مُعَقِّبَاتٌ مِّن بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ يَحْفَظُونَهُ مِنْ أَمْرِ اللَّهِ ۗ إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ ۗ وَإِذَا أَرَادَ اللَّهُ بِقَوْمٍ سُوءًا فَلَا مَرَدَّ لَهُ ۚ وَمَا لَهُم مِّن دُونِهِ مِن وَالٍ",
    "2:45 وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    "66:8 يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا عَسَىٰ رَبُّكُمْ أَن يُكَفِّرَ عَنكُمْ سَيِّئَاتِكُمْ وَيُدْخِلَكُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ يَوْمَ لَا يُخْزِي اللَّهُ النَّبِيَّ وَالَّذِينَ آمَنُوا مَعَهُ ۖ نُورُهُمْ يَسْعَىٰ بَيْنَ أَيْدِيهِمْ وَبِأَيْمَانِهِمْ يَقُولُونَ رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    "25:70 إِلَّا مَن تَابَ وَآمَنَ وَعَمِلَ عَمَلًا صَالِحًا فَأُولَٰئِكَ يُبَدِّلُ اللَّهُ سَيِّئَاتِهِمْ حَسَنَاتٍ ۗ وَكَانَ اللَّهُ غَفُورًا رَّحِيمًا",
    "7:156 وَاكْتُبْ لَنَا فِي هَٰذِهِ الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ إِنَّا هُدْنَا إِلَيْكَ ۚ قَالَ عَذَابِي أُصِيبُ بِهِ مَنْ أَشَاءُ ۖ وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ ۚ فَسَأَكْتُبُهَا لِلَّذِينَ يَتَّقُونَ وَيُؤْتُونَ الزَّكَاةَ وَالَّذِينَ هُم بِآيَاتِنَا يُؤْمِنُونَ",
    "17:25 رَّبُّكُمْ أَعْلَمُ بِمَا فِي نُفُوسِكُمْ ۚ إِن تَكُونُوا صَالِحِينَ فَإِنَّهُ كَانَ لِلْأَوَّابِينَ غَفُورًا",
    "6:54 وَإِذَا جَاءَكَ الَّذِينَ يُؤْمِنُونَ بِآيَاتِنَا فَقُلْ سَلَامٌ عَلَيْكُمْ ۖ كَتَبَ رَبُّكُمْ عَلَىٰ نَفْسِهِ الرَّحْمَةَ ۖ أَنَّهُ مَنْ عَمِلَ مِنكُمْ سُوءًا بِجَهَالَةٍ ثُمَّ تَابَ مِن بَعْدِهِ وَأَصْلَحَ فَأَنَّهُ غَفُورٌ رَّحِيمٌ"
]


def arabic(request):
    return render(request, 'La_Arabic.html')

def Ar_anxious(request):
    verse = random.choice(Ar_anxious_verses)
    return render(request, 'anxious.html', {'verse': verse})

def Ar_happy(request):
    verse = random.choice(Ar_happy_verses)
    return render(request, 'happy.html', {'verse': verse})

def Ar_thankful(request):
    verse = random.choice(Ar_thankful_verses)
    return render(request, 'thankful.html', {'verse': verse})

def Ar_lonely(request):
    verse = random.choice(Ar_lonely_verses)
    return render(request, 'lonely.html', {'verse': verse})

def Ar_angry(request):
    verse = random.choice(Ar_angry_verses)
    return render(request, 'angry.html', {'verse': verse})

def Ar_sad(request):
    verse = random.choice(Ar_sad_verses)
    return render(request, 'sad.html', {'verse': verse})

def Ar_haram_tendency(request):
    verse = random.choice(Ar_haram_tendency_verses)
    return render(request, 'haram_tendency.html', {'verse': verse})
