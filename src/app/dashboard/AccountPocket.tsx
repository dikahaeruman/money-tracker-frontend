"use client"
import { accountsData } from '@/data/accountData';
import React from 'react';


const AccountPocket = () => {
    return (
        <section className="accounts">
        {accountsData.map((account, index) => (
          <div key={index} className={`account ${account.bg}`}>
            <p className="account-name">{account.name}</p>
            <p>{account.amount}</p>
          </div>
        ))}
        <div className="account add-account">
          <button className="add-account-btn">+ Add Account</button>
        </div>
      </section>

    )
}

export default AccountPocket