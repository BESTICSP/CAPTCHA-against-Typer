# CAPTCHA-against-Typer
Typer vs. CAPTCHA: Private information based CAPTCHA to defend against crowdsourcing human cheating

Crowdsourcing human-solving or online typing attacks are destructive problems. However, studies into these topics have been limited. In this paper, we focus on this kind of attacks whereby all the CAPTCHAs can be simply broken because of its design purpose. After pursuing a comprehensive analysis of the Typer phenomenon and the attacking mechanism of CAPTCHA, we present a new CAPTCHA design principle to distinguish human (Typer) from human (user). The core idea is that the challenge process of the CAPTCHA should contain the unique information with a private attribute. The notion of our idea is based on the information asymmetry between humans. Without this private information, Typers will not be able to finish the attack even if they recognize all the characters from the CAPTCHA. 

We formalize, design and implement two examples on our proposed principle, a character-based, and a datagram-based case, according to a web interaction and password handling program. We challenge the user to select the password from the random characters that are not in the password sequence or to place the randomly sorted sequences into the correct order. A novel generation algorithm with a fuzzy matching method has been proposed to add the capability of human error tolerance and the difficulty of random guess attack. Unlike other solutions, our approach does not need to modify the primary authentication protocol, user interface, and experience of the typical web service. The several user studies' results indicate that our proposed method is both simple (can be solved by humans accurately within less than 20 seconds) and efficient (the Typer can only deploy a random guess attack with a very low success rate).

# Quick Start

Install MangoDB, node.js

yarn dev


MIT license

Programmer: Jianyi Zhang

Email: zjy@besti.edu.cn

arXiv

北京电子科技学院CSP实验室
