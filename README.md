# ethhole-santa-list

Create a user tracking dapp. Build a system for tracking who is on their nice list and who is on their naughty list. Allow for people to pay a fee to get themselves off of the naughty list. Let users on the nice list earn a portion of the fees based on how many other people are on the nice list.

Additional Rules:

- The list owner is not allowed to join any list.
- Once you are added onto the nice list, the list owner cannot move you to the naughty list.
- You can only join the nice list by moving over from the naughty list by paying a fee.
- The owner of the list is not allowed to add individuals to the nice list.
- Similarly, you can only be added to the naughty list by the owner.
- The list owner is not allowed to move you from the naughty list to the nice list.

Cryptoeconomic Notes:

- There is no real incentive to pay to join the good list if the entry fee is constant as only the participants who were added on the good list for free will be able to ever make money, due to the dilutive nature of each additional participant given a constant fee, you would never be able to make your money back if you paid a fee to get onto the good list.
- An interesting dynamic would be to increase the fee based on the number of people on the good list, thereby creating some ponzinomics which incentivize early use.
