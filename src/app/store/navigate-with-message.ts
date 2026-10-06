import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {tap} from "rxjs/operators";

/** Navigates to the target, then shows a translated success toast. */
export function navigateWithMessage(router: Router, messageService: MessageService, translate: TranslateService,
                                    key: string, navigationTarget: string) {
  return tap(() => {
    router.navigateByUrl(`/${navigationTarget}`);
    messageService.clear();
    messageService.add({severity: 'success', summary: translate.instant(key)});
  });
}
