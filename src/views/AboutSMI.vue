<template lang="pug">
  v-container(fluid).mt-0.pt-0
    v-container.pa-0.rounded-b-circle(orange fluid)
      v-img.rounded-b-circle(alt="Q DP" style="min-height:350px" border="2px solid red" src="/img/assets/home-header-1.svg" transition="scale-transition")
        p.mt-3.pa-10.text-sm-h6.text-md-h5.text-lg-h2.text-xl-h2(style="color:white;")
         b SolveMyIssue (SMI) Is An Open Community <br/> For Anyone
        //p(class="text-h1 text-sm-h6 text-md-h5 text-lg-h4 text-xl-h3") This text has responsive font size.
    v-container.mt-10.pt-10.pb-10(fluid grey lighten-2)
      v-row
        v-col(cols="12" sm="6" md="4" lg="3" v-for="wList in howSMIWorkList"  :key="wList.id")
          v-hover(v-slot="{ hover }")
              v-card(class="mx-auto", color="grey lighten-4", max-width="600")
                v-img(:aspect-ratio="10/9", :src="wList.bgImageUrl" transition="scale-transition")
                  v-expand-transition
                    div(v-if="hover", class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal text-h4 white--text", style="height: 100%")
                      | {{wList.detail}}
                v-card-text(class="pt-6", style="position: relative;")
                  v-btn(absolute, color="orange", class="white--text", fab, top)
                    v-icon {{wList.icon}}
                  v-card-title.orange--text.mb-2 {{wList.title}}
                  //h3(class="text-h4 orange--text mb-2")
                    | Ask Question
                  //div(class="font-weight-light text-h6 mb-2")
                  //  | Our Vintage kitchen utensils delight any chef.
                    br
                    | Made of bamboo by hand
          v-card(outlined	elevation="0" )
    v-container.mt-10.pt-10.pb-10.rounded-b-xl(fluid blue)
      v-row
        // First Column (Image)
        v-col(cols="12" sm="6")
          v-img(src="/img/assets/home-header-1.svg" contain fill-height)
        // Second Column (Text Detail)
        v-col(cols="12" sm="6" class="d-flex align-center")
          v-card(elevation="0" tile color="blue ")
            v-card-subtitle.text-h3(style="color:white") GET REPUTATION
            v-card-title.text-h2 How Do You Gain Reputation Points ?
            //v-card-text Description
    //p SMI About Page
    v-divider.mt-10
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name:"AboutSMIView"
})
export default class AboutSMIView extends Vue {
  howSMIWorkList: object[] = [
    {
      "title":"Ask Question",
      "id":"ask_question",
      "detail":"Get Help From Professional",
      "icon":"mdi-help",
      "extraClass":"",
      "bgImageUrl":"/img/assets/ask-question.jpg"
    },
    {
      "title":"Answer Questions",
      "id":"answer_questions",
      "detail":"Share Your Knowledge",
      "icon":"mdi-lightbulb",
      "extraClass":"",
      "bgImageUrl":"/img/assets/answer-question.png"
    },
      {
      "title":"Vote The Answers",
      "id":"vote_the_answers",
      "detail":"Give Up/Down Vote To Answers",
      "icon":"mdi-thumb-up",
      "extraClass":"",
      "bgImageUrl":"/img/assets/vote-question.jpg"
    },
      {
      "title":"Get Reputation",
      "id":"get_reputation",
      "detail":"Earn Reputation Point",
      "icon":"mdi-certificate",
      "extraClass":"",
      "bgImageUrl":"/img/assets/get-reputation.png"
    }

  ];

}
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
}
</style>
