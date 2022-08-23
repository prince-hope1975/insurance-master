"reach 0.1";

export const main = Reach.App(() => {
  const Insurance_company = Participant("Insurance_company", {
    Sub_amt: Fun([], UInt),
    Check_claim: Fun([Bytes(100)], Bool),
    Check_pay: Fun([UInt], Bool),
    deny_claim: Fun([], Null),
  });

  const Subscribers = API("Subscribers", {
    Subscribe: Fun([UInt], Null),
    Submit_claim: Fun([Bytes(100), UInt], Null),
  });

  init();
  Insurance_company.only(() => {
    const subamout = declassify(interact.Sub_amt());
  });
  Insurance_company.publish(subamout);

  
  const [usernum, subs, total_sum, user_pay] = parallelReduce([
    0,
    Array.replicate(10, Insurance_company),
    0,
    Array.replicate(10, 0),
  ])
    .invariant(balance() == total_sum)
    .while(usernum < 10)
    .api(
      Subscribers.Subscribe,
      (p) => p,
      (p, rs) => {
        rs(null);
        return [
          usernum + 1,
          subs.set(usernum, this),
          total_sum + p,
          user_pay.set(usernum, p),
        ];
      }
    );
  const word = Bytes(100).pad("user_claims");
  const [userid, userclaim, funds_requested] = parallelReduce([
    0,
    Array.replicate(10, word),
    Array.replicate(10, 0),
  ])
    .invariant(balance() == total_sum)
    .while(userid < 10)
    .api(Subscribers.Submit_claim, (claim, funds, return_statement) => {
      return_statement(null);
      return [
        userid + 1,
        userclaim.set(userid, claim),
        funds_requested.set(userid, funds),
      ];
    });
  transfer(balance()).to(Insurance_company);
  commit();
  Insurance_company.publish();

  var [
    subscriber_claim,
    subscriber_address,
    i,
    subscriber_pay,
    subscriber_funds_requested,
  ] = [userclaim, subs, 0, user_pay, funds_requested];
  invariant(balance() == 0);
  while (i < 10) {
    commit();

    Insurance_company.only(() => {
      const checkpay = declassify(interact.Check_pay(subscriber_pay[i]));
    });
    Insurance_company.publish(checkpay);

    if (checkpay) {
      commit();
      Insurance_company.only(() => {
        const get_claim = declassify(interact.Check_claim(subscriber_claim[i]));
      });
      Insurance_company.publish(get_claim);
      if (get_claim) {
        commit();
        Insurance_company.pay(subscriber_funds_requested[i]);
        transfer(subscriber_funds_requested[i]).to(subscriber_address[i]);
      } else {
        commit();
        Insurance_company.only(() => {
          const deny = declassify(interact.deny_claim());
        });
        Insurance_company.publish();
      }
    } else {
      commit();
      Insurance_company.pay(subscriber_pay[i]);
      transfer(subscriber_pay[i]).to(subscriber_address[i]);
    }
    [subscriber_claim, subscriber_address, i, subscriber_pay] = [
      subscriber_claim,
      subscriber_address,
      i + 1,
      subscriber_pay,
    ];
    continue;
  }
  commit();
});
